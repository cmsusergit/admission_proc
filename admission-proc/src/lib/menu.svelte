<script>
    import { page } from '$app/stores'

</script>
<div class="text-slate-800 px-2 py-2 mx-2 my-4 flex flex-row items-end justify-between border-b">

    <div class="text-slate-800 uppercase px-4 py-2 font-bold">Welcome {$page?.data?.session?.user?.email}</div>
    <a data-sveltekit-preload-data="tap" class="text-slate-800 uppercase px-4 py-2 hover:underline underline-offset-4 font-bold" href="/logout">
        Logout
    </a>    
</div>



