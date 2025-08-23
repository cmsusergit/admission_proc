<script>
    import { supabase } from '$lib/db'

    import { college } from '$lib/store.js' 
    import { onMount } from "svelte";
    import Profile from '$lib/component/profile/mqnri_profile.svelte'
    import VacantProfile from '$lib/component/profile/vacant_profile.svelte'
    import _ from 'lodash'
    export let profileEmail
    let profile,uploadFileList
    onMount(async()=>{
        let { data:formInfo, error:formErr } = await supabase.from('MQNRIFormInfo')
            .select(`*,Course(*),College(*),AdmissionDocumentMQNRI(*,document_label(*))`).ilike('email',profileEmail).eq('is_removed',false)

            if(formErr){
                console.log('****',formErr);
                return {error:formErr.message}        
            }
            else{
                if(formInfo.length==0){
                    let { data:formInfo1, error:formErr1 } = await supabase.from('VacantFormInfo')
                    .select(`*,Course(*),College(*),Branch(*),AdmissionDocumentVacant(*,document_label(*))`).ilike('email',profileEmail).eq('is_removed',false)
                    if(formInfo1.length>0)
                    {
                        college.set(formInfo1[0].College)
                        profile=JSON.parse(JSON.stringify(formInfo1[0]))       
                        profile['merit_number']=profile?.acpc_meritnumber                
                    }
                }
                if(formInfo.length>0){
                    college.set(formInfo[0].College)
                    profile=JSON.parse(JSON.stringify(formInfo[0]))
                    let merit_number=[]
                    if(profile.college_id==5){
                        if(profile.admission_category=='M' || profile.admission_category=='B'){
                            let { data:meritdt1, error:err1_1 } = await supabase.from('MQNRIFormInfo').select(`*`).eq('college_id',5)
                            if(err1_1)
                                return {error:err1_1.message}   
                            let merit_number1
                            const ordered1=_.orderBy(meritdt1,ob=>ob.total_merit,['desc'])
                            ordered1.forEach((ob,indx) => {
                                if(ob.id==profile.id)
                                    merit_number1=indx+1
                            });
                            merit_number.push({category:'M',college_id:5,number:merit_number1})                    
                        }
                    }   
                    else{
                        if(profile.admission_category=='M' || profile.admission_category=='B'){
                            let { data:meritdt1, error:err1_1 } = await supabase.from('mq_meritnumber').select(`*`).eq('id',profile.id).single()
                            if(err1_1)
                                return {error:err1_1.message}   
                            merit_number.push({category:'M',number:meritdt1.merit_number})
                        }
                        if(profile.admission_category=='N' || profile.admission_category=='B'){
                            let { data:meritdt1, error:err1_1 } = await supabase.from('nri_meritnumber').select(`*`).eq('id',profile.id).single()
                            if(err1_1)
                                return {error:err1_1.message}       
                            merit_number.push({category:'N',number:meritdt1.merit_number})
                        }  
                    }
                    //  
                    // let temp1=merit_number.find(ob=>ob.category=='M')
                    // if(temp1)
                    //     temp1.number=temp1?.number>0?temp1?.number+24:temp1?.number
                    profile.merit_number=merit_number

                }
                if(profile.admission_category=='M' || profile.admission_category=='N' || profile.admission_category=='B')
                    uploadFileList=profile['AdmissionDocumentMQNRI']
                else if(profile.admission_category=='V')
                    uploadFileList=profile['AdmissionDocumentVacant']
                console.log('profile**',profile);
                
            }        
    })
</script>

<div class="text-indigo-500 min-h-screen p-2 border">    
    {#if profile && uploadFileList}
        {#if profile.admission_category=='V'}
            <VacantProfile college={$college} profile={profile} uploadedFileList={uploadFileList}></VacantProfile> 
        {:else}
            <Profile college={$college} profile={profile} uploadedFileList={uploadFileList}></Profile> 
        {/if}
    {/if}
</div>





