<script>
    import {  onMount } from 'svelte'

    import {supabase} from "$lib/db"   
    import { academicYear,college } from '$lib/store.js'    
    import _ from 'lodash'
    export let profile,uploadedFileList
    import config from '$lib/config.json'
    import {mqnri_profile_print1,mqnri_profile_print} from '$lib/mqnri_print.js' 
    import {goto} from '$app/navigation'
    let userPhotoUrl=null,isMeritDisplay=config.isMeritDisplay
    let isEditEnabled=false
    
    onMount(async()=>{              
        if(profile.college_id==5){
            let { data:meritdt1, error:err1_1 } = await supabase.from('MQNRIFormInfo').select(`*`).eq('college_id',5)
            if(err1_1)
                return {error:err1_1.message}   
            let merit_number1
            const ordered1=_.orderBy(meritdt1,ob=>Number(ob.acpc_meritnumber),['asc'])
            const ordered1_1=_.filter(ordered1,ob=>{
                if(ob.acpc_meritnumber && ob.acpc_meritnumber!=null && ob.acpc_meritnumber!='' && ob.acpc_meritnumber!='-' && Number(ob.acpc_meritnumber)!=0)
                    return true
                else
                    return false
            })
            ordered1_1.forEach((ob,indx) => {
                if(ob.id==profile.id)
                    merit_number1=indx+1
            });
            let temp1=[...profile?.merit_number]
            temp1.map((dt)=>{
                if(dt.category=='M')            
                    dt.number=merit_number1
            })
            let tempp={...profile}
            tempp.merit_number=[...temp1]
            profile={...tempp}
            console.log('----',profile)            
        }      
        else{
            //....
            let temp1=[...profile?.merit_number]//....
            temp1.map((dt)=>{
                if(dt.category=='M' && dt.number>=5)            
                    dt.number=dt.number+25
            })
            let tempp={...profile}
            tempp.merit_number=[...temp1]
            profile={...tempp}
            console.log('----',profile);
        }
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
    const updateRecord=(record)=>{      
        goto(`/admissionform/mqnri?ayear_id=${record.academic_year}&is_update=${record.id}&college_id=${record?.college_id}`)        
    }
</script>


{#if profile?.is_removed}
    <p class="text-4xl text-center">Your Profile has been Removed</p>
    <p class="text-xl text-center">Please, Contact Admission Officer</p>
{:else if !profile?.is_payment_done}

    <p class="text-4xl text-center">Your Payment is Pending</p>
    <p class="text-xl text-center">For further Query Please, Contact Admission Officer</p>
    <div class="mt-4 flex border justify-center p-2 border">
        {#if !profile?.is_payment_done}   
        {#if profile?.college_id!=5}
            {#if profile?.admission_category=="B"}
                <a class="p-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://u.payu.in/PAYUMN/qr16orXnJuCp'>Payment</a>            
                <!-- <a class="p-2 mr-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://pmny.in/0rHjN55yRlY9'>Payment</a> -->
            {:else}
            <!-- <a class="p-2 mr-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://pmny.in/oJn4PnkUUQrW'>Payment</a> -->
            <a class="p-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://u.payu.in/PAYUMN/6IuYjePG0lpv'>Payment</a> 
            {/if}        
        {:else}
            <div class="my-4 text-lg text-center text-blue-700 hover:text-blue-500">
                To Proceed For Payment: <a href='https://u.payu.in/PAYUMN/xI4lkShmyEp5'>Click Here</a>
            </div>
        {/if}
        {/if}
    </div>
{:else}
    {#if profile}
        <div class="min-h-screen w-full">    
            <div class="flex justify-end p-1 gap-2">     
                {#if !profile.is_payment_done}   

                    {#if profile.college_id!=5}
                        {#if profile.admission_category=="B"}
                            <!-- <a class="p-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://pmny.in/kIvMHRAlgOIT'>Payment</a>            
                            <a class="p-2 mr-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://pmny.in/0rHjN55yRlY9'>Payment</a> -->
                            <a class="p-2 mr-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://u.payu.in/PAYUMN/qr16orXnJuCp'>Payment</a>
                        {:else}
                        <!-- <a class="p-2 mr-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://pmny.in/oJn4PnkUUQrW'>Payment</a>
                        <a class="p-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://pmny.in/sJm4MSoHvJO0'>Payment</a>  -->

                        <a class="p-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://u.payu.in/PAYUMN/6IuYjePG0lpv'>Payment</a>  

                        <a class="p-2 text-center bg-blue-700 text-white hover:bg-blue-500 w-48 cursor-pointer rounded" href='https://u.payu.in/PAYUMN/6IuYjePG0lpv'>Payment</a> 

                        {/if}  
                    {:else}
                        <div class="my-4 text-lg text-center text-blue-700 hover:text-blue-500">
                            To Proceed For Payment: <a href='https://u.payu.in/PAYUMN/xI4lkShmyEp5'>Click Here</a>
                        </div>
                    {/if}      
                {/if}
                <button on:click={acpcPrint} class="bg-blue-700 hover:bg-blue-500 text-white p-2 w-48 rounded">Profile Report</button>
                {#if profile.admission_category=='V'}
                    <button on:click={vacantPrint} class="bg-blue-700 hover:bg-blue-500 text-white p-2 w-48 rounded">VACANT Report</button>
                {:else}
                    <button on:click={mqnriPrint} class="bg-blue-700 hover:bg-blue-500 text-white p-2 w-48 rounded">MQNRI Report</button>
                {/if}

                {#if isEditEnabled}
                    <button on:click={()=>updateRecord(profile)} class="bg-blue-700 hover:bg-blue-500 text-white p-2 w-48 rounded text-center">Edit</button>
                {/if}
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
                    <h2 class="text-2xl px-4 font-medium text-gray-800 h-full">
                        {#if profile.form_number['M']}MQ Form Number - {profile.form_number['M']}{/if} |
                        {#if profile.form_number['N']}NRI Form Number - {profile.form_number['N']}{/if}
                    </h2>                
                    <h2 class="text-2xl px-4 font-medium text-gray-800 h-full">User Profile - {profile.id}</h2>
                </div>
                {#if profile?.merit_number && isMeritDisplay}
                    <div class="bg-slate-500 text-white my-4 p-2 text-center">
                        <h2 class="text-xl text-white px-4 font-bold">Merit Number</h2>                
                        {#each profile?.merit_number as record}                   
                            <span class="text-2xl text-white px-4 font-bold">{record.category=='M'?'Management Quota':'NRI/NRI Sponsored Quota'}-{record.number}</span>
                            {#if record.category=='M' && record.number<=50}
                                <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 01/08/2025 (10.30 a.m. to 12:30)</p>
                            {:else if record.category=='M' && (record.number>=51 && record.number<=100)}                        
                                <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 01/08/2025 (01.30 p.m. onwards)</p>
                            {:else if record.category=='M' && (record.number>=101 && record.number<=150)}
                                <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 17/06/2025 (11.00 a.m. to 01.00 a.m.)</p>
                            {:else if record.category=='M' && (record.number>=151 && record.number<=200)}
                                <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 17/06/2025 (02.00 p.m. to 04.00 p.m.)</p>
                            {:else if record.category=='M' && (record.number>=201 && record.number<=250)}
                                <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 18/06/2025 (11.00 a.m. to 01.00 p.m.)</p>
                            {:else if record.category=='M' && record.number>=251}
                                <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 18/06/2025 (02.00 p.m. to 04.00 p.m.)</p>
                            {:else if record.category!=='M' && record.number<=50}
                                <p class="text-xl text-white px-4 font-bold">Counseling Schedule: 16/06/2025 (10.00 a.m. to 11.00 a.m.)</p>
                            {/if}
                            {#if record.college_id==5 && record.category=='M'}
                                <a class="text-white text-xl p-2 underline" href="https://mhazmbcbujixalspvqrz.supabase.co/storage/v1/object/public/document//Call%20Letter%20Diploma%202025.pdf">Download Call Letter</a>
                            {:else if record.category=='M'}
                                <a class="text-white text-xl p-2 underline" href="https://mhazmbcbujixalspvqrz.supabase.co/storage/v1/object/public/document//MQ%20Call%20Letter_2025.pdf">Download Call Letter</a>
                                <br>
                            {:else}
                                <a class="text-white text-xl p-2 underline" href="https://mhazmbcbujixalspvqrz.supabase.co/storage/v1/object/public/document//NRI%20Call%20Letter_2025.pdf">Download Call Letter (NRI/NRI Sponsored Quota)</a>
                                <br>
                            {/if}
                        {/each}
                        <p class="bg-orange-500 text-white px-2 py-2 font-bold w-full mt-4 text-2xl">*Tuition fee are subjected to approval of FRC Technical for year 2025-26</p>
                    </div>
                {/if}
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
                            <tr class="border-slate-500 border-b w-full px-2 py-2">
                                <td class="w-1/4 text-lg px-2 py-2 font-bold">Student ABC Id</td>
                                <td class="text-lg px-2 py-2">
                                    {profile?.student_abc_id??'-'}
                                </td>
                            </tr>
                            <tr class="border-slate-500 border-b w-full px-2 py-2">
                                <td class="w-1/4 text-lg px-2 py-2 font-bold">Student UDISE</td>
                                <td class="text-lg px-2 py-2">
                                    {profile?.UDISE_Number??'-'}
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
                                <td class="w-1/4 text-lg px-2 py-2 font-bold">Name AS Per AadharCard</td>
                                <td class="text-lg px-2 py-2">
                                    {profile?.name_as_per_aadhar??'-'}
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
                            {#if profile?.entrnceExamDetail && profile?.entrnceExamDetail?.length!=0}
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
                            {/if}
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
{/if}












