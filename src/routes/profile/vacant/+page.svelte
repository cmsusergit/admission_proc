<script>
    import Profile from '$lib/component/profile/vacant_profile.svelte'

    export let data
    let profile=data?.profile
    if(data?.merit_number){
        let temp1=data?.merit_number.find(ob=>ob.category=='M')
        if(temp1){
            temp1.number=temp1.number>11?temp1.number+24:temp1.number
            profile['merit_number']=data?.merit_number
        }
        else{

            profile['merit_number']='-'
        }
    }
    let uploadedFileList=data?.uploadedFileList
</script>
<div class="min-h-screen w-full">
    <Profile profile={profile} uploadedFileList={uploadedFileList}></Profile>        
</div>
