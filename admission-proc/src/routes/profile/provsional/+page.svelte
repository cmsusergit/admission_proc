<script>
    import Profile from '$lib/component/profile/provsional.svelte'

    export let data
    let profile=data?.profile

</script>
<div class="min-h-screen w-full">
    <Profile profile={profile}></Profile>
</div>













