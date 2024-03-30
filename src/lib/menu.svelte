<script>
    import { page } from '$app/stores'
    import { onMount } from 'svelte';

    let isReportOpen = false,role=''
    let isAdminOpen = false
    const handleReport=()=>{
        isReportOpen = !isReportOpen
    }
    const handleReportFocusLoss = ({ relatedTarget, currentTarget }) => {
        if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null) 
        isReportOpen = false
    }

    const handleAdmin=()=>{
        isAdminOpen = !isAdminOpen
    }
    const handleAdminFocusLoss = ({ relatedTarget, currentTarget }) => {
        if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null) 
        isAdminOpen = false
    }
    onMount(()=>{
        role=$page?.data?.session?.user?.user_metadata?.role
    })
</script>
<div class="text-slate-800 px-2 py-2 mx-2 my-4 flex flex-row items-end justify-between border-b">
    {#if $page?.data?.session}
        <div class="text-slate-800 uppercase px-4 py-2 font-bold">Welcome {$page?.data?.session?.user?.email}</div>
                <div class="flex items-center">      
                    {#if role && (role=='admin' || role=='trustee')}
                    <div class="dropdown md:mr-4 hover:underline" on:focusout={handleAdminFocusLoss}>
                        <button on:click={handleAdmin} class="uppercase font-bold flex justify-end items-center">
                            Admin<svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {#if isAdminOpen}
                            <ul class="dropdown-content menu p-2 shadow bg-white absolute rounded-box w-52">
                                <li class="bg-white text-slate-800 px-2 py-1 hover:bg-gray-100"><a href={`/feemetadetail`}>Fee Subscheme</a></li>
                            </ul>
                        {/if}
                    </div>
                    <div class="dropdown md:mr-4 hover:underline" on:focusout={handleReportFocusLoss}>
                        <button on:click={handleReport} class="uppercase font-bold flex justify-end items-center">
                            Report<svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {#if isReportOpen}
                            <ul class="dropdown-content menu p-2 shadow bg-white absolute rounded-box w-52">
                                <li class="bg-white text-slate-800 px-2 py-1 hover:bg-gray-100"><a href={`/report/prov2mqnri`}>Prov -> MQNRI</a></li>
                                <li class="bg-white text-slate-800 px-2 py-1 hover:bg-gray-100"><a href={`/report/feereport`}>Fees Report</a></li>

                                <li class="bg-white text-slate-800 px-2 py-1 hover:bg-gray-100"><a href={`/report/admission_total`}>Admission Report</a></li>
                            </ul>
                        {/if}
                    </div>
                    {/if}
                    <a data-sveltekit-preload-data="tap" class="text-slate-800 uppercase px-4 py-2 hover:underline underline-offset-4 font-bold" href="/logout">
                        Logout
                    </a> 
                </div>
    {:else}
        <div class="text-slate-800 uppercase px-4 py-2 font-bold">Welcome Guest</div>        
        <a data-sveltekit-preload-data="tap" class="text-slate-800 uppercase px-4 py-2 hover:underline underline-offset-4 font-bold" href="/">
            Login
        </a>    
    {/if}
</div>

