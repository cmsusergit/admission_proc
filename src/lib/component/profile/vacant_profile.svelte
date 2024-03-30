<script>
    import {  onMount } from 'svelte'

    import {supabase} from "$lib/db"   
    import { academicYear,college } from '$lib/store.js'    
    export let profile,uploadedFileList
    import {mqnri_profile_print1,mqnri_profile_print} from '$lib/mqnri_print.js'
    let userPhotoUrl=null
    onMount(()=>{                  
    })
    

    
    const downloadImage = async (path) => {
		try {
            const { data, error } = await supabase.storage.from('userphoto').download(path)
            if (error) {
				throw error
			}
			const url = URL.createObjectURL(data)
			userPhotoUrl = url
            return userPhotoUrl
		} 
        catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message)
			}
		}
	}
    const mqnriPrint=async()=>{
        let { data: college, error } = await supabase
        .from('College')
        .select('*').eq('id',profile.college_id).single()        
        if(error){
            console.log('****',error)
            return
        }        
        let { data: ayear, error1 } = await supabase
        .from('AcademicYear')
        .select('*').eq('id',profile.academic_year).single()
        if(error1){
            console.log('****',error1)
            return
        }
        mqnri_profile_print(college,ayear?.name,profile)
    }
    const vacantPrint=async()=>{
        let { data: college, error } = await supabase
        .from('College')
        .select('*').eq('id',profile.college_id).single()        
        if(error){
            console.log('****',error)
            return
        }        
        let { data: ayear, error1 } = await supabase
        .from('AcademicYear')
        .select('*').eq('id',profile.academic_year).single()
        if(error1){
            console.log('****',error1)
            return
        }
        mqnri_profile_print(college,ayear?.name,profile)
    }
    const acpcPrint=()=>{        
        mqnri_profile_print1($college,$academicYear?.name,profile)
    }
</script>
{#if profile}
    <div class="min-h-screen w-full">    
        <div class="flex justify-end">        
            <a class="p-2 mr-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://pmny.in/kIDcWXiuJGZz'>Payment</a>
            <button on:click={acpcPrint} class="bg-blue-700 hover:bg-blue-500 text-white p-2 mr-4 w-48 rounded">Profile Report</button>
            <button on:click={vacantPrint} class="bg-blue-700 hover:bg-blue-500 text-white p-2 w-48 rounded">VACANT Report</button>
        </div> 
        <div>
            <div class="w-full overflow-auto flex justify-between items-center">        
                {#await downloadImage(profile?.photo)}
                    <p>Loading....</p>
                {:then path}
                {#if path}
                    <img src={path} class="m-2 w-28" alt="">
                {:else}
                    <p class="text-slate-500 font-bold">{profile?.photo}</p>
                {/if}
                {:catch error1}
                    <p>{error1.message}</p>
                {/await}
                    
                <!-- <h2 class="text-2xl px-4 font-medium text-gray-800 h-full">
                    {#if profile.form_number['M']}MQ Form Number - {profile.form_number['M']}{/if} |
                    {#if profile.form_number['N']}NRI Form Number - {profile.form_number['N']}{/if}
                </h2>                 -->
                <h2 class="text-2xl px-4 font-medium text-gray-800 h-full">User Profile - {profile.id}</h2>
            </div>
            <!-- {#if profile?.merit_number}
                <div class="bg-orange-500 my-4 p-2 text-center">
                    <h2 class="text-xl text-white px-4 font-bold">Merit Number</h2>                
                    {#each profile?.merit_number as record}                   
                        <span class="text-2xl text-white px-4 font-bold">{record.category=='M'?'Management Quota':'NRI/NRI Sponsored Quota'}-{record.number}</span>
                        {#if record.category=='M' && record.number<=50}
                            <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 10/07/2023 (12.00 noon to 01.00 p.m.)</p>
                        {:else if record.category=='M' && (record.number>=51 && record.number<=150)}                        
                            <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 10/07/2023 (02.00 p.m. to 04.00 p.m.)</p>
                        {:else if record.category=='M' && (record.number>=151 && record.number<=200)}
                            <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 11/07/2023 (10.00 a.m. to 11.00 a.m.)</p>
                        {:else if record.category=='M' && (record.number>=201 && record.number<=250)}
                            <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 11/07/2023 (12.00 noon to 01.00 p.m.)</p>
                        {:else if record.category=='M' && record.number>=251}
                            <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 11/07/2023 (02.00 p.m. to 04.00 p.m.)</p>
                        {:else if record.category!=='M' && record.number<=50}
                            <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 10/07/2023 (10.00 a.m. to 11.00 a.m.)</p>
                        {/if}
                        {#if record.category=='M'}
                            <a class="text-white text-xl p-2 underline" href="https://mhazmbcbujixalspvqrz.supabase.co/storage/v1/object/public/document/MQ%20Call%20Letter.pdf">Download Call Letter</a>
                            <br>
                        {:else}
                            <a class="text-white text-xl p-2 underline" href="https://mhazmbcbujixalspvqrz.supabase.co/storage/v1/object/public/document/NRI%20Call%20Letter.pdf">Download Call Letter (NRI/NRI Sponsored Quota)</a>
                            <br>
                        {/if}
                    {/each}
                </div>
            {/if} -->
            <div class="text-gray-800 w-full shadow sm:rounded-lg">
                <div class="bg-white border rounded my-2 text-gray-800">
                    <table class="border-slate-500 border w-full p-2">        
                        
                        <tr class="border-slate-500 bg-slate-500 text-white border-b w-full px-2 py-2">
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Admission Details</td>
                            <td></td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Admission Category</td>
                            <td class="text-lg px-2 py-2">
                                {profile?.admission_category}
                            </td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Course</td>
                            <td class="text-lg px-2 py-2">
                                {profile?.Course?.name}
                            </td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Branch</td>
                            <td class="text-lg px-2 py-2">
                                {profile?.Branch?.name?profile?.Branch?.name:'-'}
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="bg-white border rounded my-2 text-gray-800">
                    <table class="border-slate-500 border w-full p-2">  
                        <tr class="border-slate-500 bg-slate-500 text-white border-b w-full px-2 py-2">
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Personal Details</td>
                            <td></td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Name</td>
                            <td class="text-lg px-2 py-2">
                                {profile?.title} {profile?.first_name} {profile?.middle_name} {profile?.last_name}
                            </td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Contact</td>
                            <td class="text-lg px-2 py-2">
                                {profile?.contact}
                            </td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">                            
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Email</td>
                            <td class="text-lg px-2 py-2">
                                {profile?.email}
                            </td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">            
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">DOB</td>
                            <td class=" w-1/4 text-lg px-2 py-2">
                                {new Date(profile?.dob).toLocaleDateString()}
                            </td>                            
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">            
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Gender</td>
                            <td class="w-1/4 text-lg px-2 py-2">{profile?.gender}</td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">            
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Blood Group</td>
                            <td class="w-1/4 text-lg px-2 py-2">{profile?.blood_group}</td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">            
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Religion</td>
                            <td class="w-1/4 text-lg px-2 py-2">{profile?.religion}</td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">    
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Nationality</td>
                            <td class="w-1/4 text-lg px-2 py-2">{profile?.nationality}</td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">    
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Category</td>
                            <td class="w-1/4 text-lg px-2 py-2">{profile?.category}</td>
                        </tr>                        
                        <tr class="border-slate-500 border-b w-full px-2 py-2">    
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Caste</td>
                            <td class="w-1/4 text-lg px-2 py-2">{profile?.caste}</td>

                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">    

                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Aadhar Number</td>
                            <td class="w-1/4 text-lg px-2 py-2">{profile?.aadharnumber}</td>
                        </tr>                        
                        <tr class="border-slate-500 border-b w-full px-2 py-2">            
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Present Address</td>
                            <td class=" w-full text-lg px-2 py-2">
                                {profile?.present_addr1} {profile.present_addr2?`,${profile.present_addr2}`:''} <br>
                                {profile?.present_city}, {profile?.present_state} <br>
                                {profile?.present_country} - {profile?.present_zipcode}
                            </td>                           
                        </tr>
                        <tr class="border-slate-500 mb-2 w-full px-2 py-2">            
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Permanent Address</td>
                            <td class=" w-full text-lg px-2 py-2">
                                {profile?.per_addr1} {profile.per_addr2?`,${profile.per_addr2}`:''} <br>
                                {profile?.per_city}, {profile?.per_state} <br>                               
                                {profile?.per_country} - {profile?.per_zipcode}
                            </td>                           
                        </tr>
                    </table>
                </div>
                <div class="w-full bg-white border rounded my-2 text-gray-800">
                    <table class="border-slate-500 border w-full p-2">
                        <tr class="bg-slate-500 text-white border-b w-full px-2 py-2">
                            <td class="w-1/4 text-lg px-2 py-2 font-bold">Guardian Details</td>
                            <td></td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="text-lg w-1/4 px-2 py-2 font-bold">Mother Name</td>
                            <td class="w-full text-lg px-2 py-2">
                                {profile?.mother_name}
                            </td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="text-lg w-1/4 px-2 py-2 font-bold">Mother Contact</td>
                            <td class="w-full text-lg px-2 py-2">
                                {profile?.mother_contact} {profile?.mother_email?`(${profile?.mother_email})`:''}
                            </td>
                        </tr> 
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="text-lg w-1/4 px-2 py-2 font-bold">Father Name</td>
                            <td class="w-full text-lg px-2 py-2">
                                {profile?.father_name}
                            </td>
                        </tr>
                        <tr class="border-slate-500 mb-2 w-full px-2 py-2">
                            <td class="text-lg w-1/4 px-2 py-2 font-bold">Father Contact</td>
                            <td class="w-full text-lg px-2 py-2">
                                {profile?.father_contact} {profile?.father_email?`(${profile?.father_email})`:''}
                            </td>
                        </tr>                        
                    </table>
                </div>
                <div class="bg-white border rounded my-2 text-gray-800">
                    <table class="border-slate-500 border w-full p-2">                        
                        <tr class="border-slate-500 bg-slate-500 text-white border-b w-full px-2 py-2">
                            <td class="text-lg px-2 py-2 font-bold" colspan="4">Academic/Result Details</td>
                            <td></td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="text-lg px-2 py-2 text-center font-bold">Board Name</td>
                            <td class="text-center text-lg px-2 py-2 font-bold">Result</td> 
                        </tr>
                        {#each profile?.boardList as record}                            
                            <tr class="border-slate-500 border-b w-full px-2 py-2">
                                <td class="text-lg px-2 py-2 text-center">
                                    {record?.board}                                
                                </td>
                                <td class="text-lg px-2 py-2 text-center">                                        
                                    {record?.result}
                                </td>                                
                            </tr>
                        {/each}
                    </table>
                </div>
                <div class="bg-white border rounded my-2 text-gray-800">                    
                    <table class="border-slate-500 border w-full">                        
                        <tr class="border-slate-500 bg-slate-500 text-white border-b w-full px-2 py-2">
                            <td class="text-lg px-2 py-2 font-bold" colspan="5">Board Result Details</td>                            
                            <td></td><td></td><td></td><td></td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="border-slate-500 border-b text-center font-bold p-2">Subject Name</td>
                            <td class="border-slate-500 border-b text-center font-bold p-2">Theory (Obtained)</td>
                            <td class="border-slate-500 border-b text-center font-bold p-2">Theory (Out of)</td>
                            <td class="border-slate-500 border-b text-center font-bold p-2">Practical (Obtained)</td>
                            <td class="border-slate-500 border-b text-center font-bold p-2">Practical (Out of)</td>
                        </tr>
                        {#each profile?.subjectResultList as record}
                            <tr class="border-slate-500 border-b w-full px-2 py-2">
                                <td class="text-lg px-2 py-2 text-center">
                                    {record?.subName[record.selectedIndx]}                                
                                </td>
                                <td class="text-center text-lg px-2 py-2">                                        
                                    {record?.theoryObtained} 
                                </td>                        
                                <td class="text-center text-lg px-2 py-2">                                        
                                    {record?.theoryOutof}       
                                </td>
                                <td class="text-center text-lg px-2 py-2">                                        
                                    {record?.practicalObtained}
                                </td>                         
                                <td class="text-center text-lg px-2 py-2">
                                    {record?.practicalOutof}
                                </td>       
                            </tr>
                        {/each}
                    </table>
                </div>
                <div class="bg-white border rounded my-2 text-gray-800">                    
                    <table class="border-slate-500 border w-full">                        
                        <tr class="border-slate-500 bg-slate-500 text-white border-b w-full px-2 py-2">
                            <td class="text-lg px-2 py-2 font-bold" colspan="5">Entrnce Examination Result Details</td>                            
                            <td></td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="border-slate-500 border-b text-center font-bold p-2">Subject Name</td>
                            <td class="border-slate-500 border-b text-center font-bold p-2">GUJCET</td>
                        </tr>
                        {#each profile?.entrnceExamDetail as record}
                            <tr class="border-slate-500 border-b w-full px-2 py-2">
                                <td class="text-lg px-2 py-2 text-center">
                                    {record?.subName}                                
                                </td>
                                <td class="text-center text-lg px-2 py-2">                                        
                                    {record?.gujcetReult} 
                                </td>       
                            </tr>
                        {/each}
                    </table>
                </div>            
                <div class="bg-white border rounded my-2 text-gray-800">                    
                    <table class="border-slate-500 border w-full">                        
                        <tr class="border-slate-500 bg-slate-500 text-white border-b w-full px-2 py-2">
                            <td class="text-lg px-2 py-2 font-bold" colspan="5">Uploaded Documents</td>                            
                            <td></td>
                        </tr>
                        
                        {#each uploadedFileList as record}
                            <tr class="border-slate-500 border-b w-full px-2 py-2">
                                <td class="text-lg px-2 py-2 text-center">                                
                                {#await downloadImage(record?.document_path)}
                                    <p>Loading....</p>
                                {:then path}
                                {#if path}
                                    <a class="m-2 text-blue-800 px-2 hover:text-blue-700 py-2 underline font-bold" href="{path}">
                                        {record?.document_label.name}
                                    </a>
                                {:else}
                                    <p class="text-slate-500 font-bold">{record?.document_label.name}</p>
                                {/if}
                                {:catch error1}
                                    <p>{error1.message}</p>
                                {/await}
                                </td>   
                            </tr>
                        {/each}
                    </table>
                </div>
                <div class="mb-4 font-bold"></div>
            </div></div>
        </div>
{/if}