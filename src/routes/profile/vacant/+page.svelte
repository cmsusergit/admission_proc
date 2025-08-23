<script>
    import Profile from '$lib/component/profile/vacant_profile.svelte'

    export let data
    let profile=data?.profile
    if(data?.merit_number){
        if(profile?.college_id==6 || (profile?.college_id==1 && profile?.course==10)){
                profile['merit_number']=profile?.acpc_meritnumber
            } else{
                profile['merit_number']='-'        
            }
        

        // if(temp1){
        //     temp1.number=temp1.number>11?temp1.number+24:temp1.number
        //     profile['merit_number']=data?.merit_number
        // }
        // else{

        //     profile['merit_number']='-'
        // }
    }
    let uploadedFileList=data?.uploadedFileList
</script>
<div class="min-h-screen w-full">
    <Profile profile={profile} uploadedFileList={uploadedFileList}></Profile>        
</div>
