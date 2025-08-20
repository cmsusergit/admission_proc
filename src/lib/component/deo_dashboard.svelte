<script>  
    import {supabase} from '$lib/db.js'

    import { mesg,college } from '$lib/store.js'    
    import { onMount } from 'svelte'
    
    let selectedAyear
    let collegeList,error_mesg=''
    const formList=[{name:"ACPC",path:"acpc"},{name:"Prov",path:"provsional"},{name:"MQNRI",path:"mqnri"},{name:"VACANT",path:"vacant"}]
    onMount(async()=>{
        let { data:dt, error } = await supabase
            .from('AcademicYear').select('*').eq('is_current',true).single()

        if(error)
            error_mesg=error.message
        selectedAyear=dt
        let { data:collegelist, error1 } = await supabase
            .from('College').select('*')            
        if(error1)
            error_mesg=error1.message
        collegeList=collegelist

})
</script>
<div class="min-h-screen w-full">
    {#if $mesg}
        <div class="w-full flex justify-between p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-emerald-500 text-xl">{$mesg}</div>
            <button on:click={()=>$mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}
    {#if error_mesg}
        <div id="errormesg" class="w-full flex justify-between mt-2 mb-4 p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-orange-800 text-xl">{error_mesg}</div>
            <button on:click={()=>error_mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}    
    <div class="flex justify-between p-1 lg:flex-row flex-col">
        <div class="flex flex-col w-full m-1"><p class="text-lg font-bold text-center bg-white text-slate-700 p-2">Academic Year {selectedAyear?.name}</p></div>
    </div>    
    {#if selectedAyear && collegeList}
        <div class="mt-2 flex justify-center flex-col">
            {#each collegeList as college}            
                <div class="border bg-slate-50 px-2 py-2 text-slate-800 w-full mt-2 text-center text-lg shadow shadow-slate-500 rounded">
                    <div class="flex justify-center md:space-y-2 flex-col">         
                        <div class="bg-slate-500 text-white font-bold text-center text-xl p-2">{college.name}({college.alias})</div>
                        <ul class="flex md:flex-row md:justify-center flex-col items-center md:space-x-2 md:space-y-0 space-y-2 my-2 w-full">
                        {#each formList as formType}       

                            <li>  
                                <div class="bg-blue-500 w-48 text-center text-lg font-bold text-slate-50 rounded-lg hover:bg-blue-800 cursor-pointer">
                                    <a class="text-white hover:font-bold m-5 px-4 py-2" href={`/admissionform/${formType.path}?ayear_id=${selectedAyear.id}&college_id=${college.id}`}>
                                        {formType.name}
                                    </a>
                                </div>
                            </li>
                        {/each}</ul>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
