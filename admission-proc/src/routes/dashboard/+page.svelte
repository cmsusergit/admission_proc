<script>
    import { supabase } from '$lib/db'

    import { college } from '$lib/store.js' 
    import { onMount } from "svelte";
    import Profile from '$lib/component/profile/mqnri_profile.svelte'
    export let profileEmail
    let profile,uploadFileList
    onMount(async()=>{
        let { data:formInfo, error:formErr } = await supabase.from('MQNRIFormInfo')
            .select(`*,Course(*),College(*),AdmissionDocumentMQNRI(*,document_label(*))`).eq('email',profileEmail).single()
            if(formErr){

            return {error:formErr.message}        
        }
        else{
            college.set(formInfo.College)
            
            profile=JSON.parse(JSON.stringify(formInfo))
            uploadFileList=profile['AdmissionDocumentMQNRI']
        }        
    })
</script>
<div class="text-indigo-500 min-h-screen p-2 border">    
    {#if profile && uploadFileList}
        <Profile college={$college} profile={profile} uploadedFileList={uploadFileList}></Profile> 
    {/if}
</div>