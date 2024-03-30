<script>
    import {  onMount } from 'svelte'

    import {supabase} from "$lib/db"   
    import { academicYear,college } from '$lib/store.js'    
    export let profile,uploadedFileList
    import {acpc_profile_print} from '$lib/mqnri_print.js'
    import { acpc_recipt_print } from '$lib/reciept_print.js';
    
    onMount(()=>{})



    const downloadImage = async (path) => {		
		try {
            const { data, error } = await supabase.storage.from('userphoto').download(path)
            if (error) {
                throw error
			}
			const url = URL.createObjectURL(data)
            return url
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message)
			}
		}
	}
    const acpcReceiptPrint=async()=>{
        let { data: feeFormInfo, error:feeError1 } = await supabase
            .from('AdmissionFeesCollectionACPC')
            .select('*,AcademicYear(*),Course(*, College(*)),Branch(*)')        
            .eq('form_id',profile?.id)
        if(feeError1)
        {
            return feeError1
        }   
        let { data:feeSchemeListDt, error:fs_error } = await supabase
        .from('AdmissionFeesScheme').select(`*,AdmissionSubFeesInfo(*,AdmissionFeesCategory(*))`)
        if(fs_error)
            return {error:fs_error.message} 
        const feeSchemeList=feeSchemeListDt?.find(ob=>ob.id==feeFormInfo[0]?.fees_scheme)
        acpc_recipt_print(feeFormInfo[0],feeSchemeList)        
    }
    const acpcPrint=()=>{        
        acpc_profile_print($college,$academicYear?.name,profile)
    }
</script>
<div class="min-h-screen w-full">   
    <div class="flex justify-end p-2 space-x-2">        
        <button on:click={acpcPrint} class="bg-blue-700 hover:bg-blue-500 text-white p-2 w-48 rounded">ACPC Report</button>
        <button on:click={acpcReceiptPrint} class="bg-blue-700 hover:bg-blue-500 text-white p-2 w-48 rounded">FeeReceipt</button>
    </div> 
    <div>
        <div class="w-full overflow-auto flex my-4 justify-between items-center">             
        {#if profile?.photo}
            {#await downloadImage(profile?.photo)}
                <p>Loading....</p>
            {:then path}
            {#if path}
                <img src={path} class="m-2 w-28" alt="">
            {/if}
            {:catch error1}
                <p>{error1.message}</p>
            {/await}
        {/if}
        <h2 class="text-2xl px-4 font-medium text-gray-800 h-full">College ID: {profile?.student_college_id??'-'}</h2>
        <h2 class="text-2xl px-4 font-medium text-gray-800 h-full">
            ACPC Form Number - {(profile?.form_number && profile?.admission_category)?(profile?.form_number[profile?.admission_category]):'-'}
        </h2>
        <h2 class="text-2xl px-4 font-medium text-gray-800 h-full">User Profile - {profile.id}</h2>
        </div>
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
                            {profile?.Course?.name} {profile?.is_d2d?'(D2D)':''}
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

                    {#if profile?.boardList}
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
                    {/if}
                </table>
            </div>






            
            {#if profile?.subjectResultList && profile?.subjectResultList.length>0}
                <div class="bg-white border rounded my-2 text-gray-800">                    
                    <table class="border-slate-500 border w-full">                        
                        <tr class="border-slate-500 bg-slate-500 text-white border-b w-full px-2 py-2">
                
                        <td class="text-lg px-2 py-2 font-bold" colspan="2">Board Result Details</td>                            
                            <td></td>
                        </tr>
                        <tr class="border-slate-500 border-b w-full px-2 py-2">
                            <td class="border-slate-500 border-b text-center font-bold p-2">Subject Name</td>
                            <td class="border-slate-500 border-b text-center font-bold p-2">Theory (Obtained)</td>
                        </tr>
                        {#each profile?.subjectResultList as record}
                            <tr class="border-slate-500 border-b w-full px-2 py-2">
                                <td class="text-lg px-2 py-2 text-center">
                                    {record?.subName}                                
                                </td>
                                <td class="text-center text-lg px-2 py-2">                                        
                                    {record?.result} 
                                </td>                
                            </tr>
                        {/each}
                    </table>
                </div>
            {/if}
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