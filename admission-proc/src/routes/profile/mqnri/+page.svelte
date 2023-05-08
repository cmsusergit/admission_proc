<script>
    import Profile from '$lib/component/profile/mqnri_profile.svelte'

    export let data
    let profile=data?.profile
    let uploadedFileList=data?.uploadedFileList
</script>
<div class="min-h-screen w-full">
    <Profile profile={profile} uploadedFileList={uploadedFileList}></Profile>        
</div>
