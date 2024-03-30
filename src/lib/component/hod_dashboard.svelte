<script>
    import {supabase} from '$lib/db.js'

    import { mesg,college } from '$lib/store.js'    
    import { onMount } from 'svelte'
    
    let selectedAyear,count
    let collegeList,error_mesg=''

    const formList=["ACPC","Provisional","Management/NRI","Vacant"]



    const fetchCount=async(id)=>{
        if(!id)return
        const { data:count1, error1 } = await supabase.rpc('fetchcount',{'academicyear_id':id})
        if(error1)    
            alert(error1.message)    
        count=count1
    }
    $:fetchCount(selectedAyear?.id)
    onMount(async()=>{
        let { data:dt, error } = await supabase
            .from('AcademicYear').select('*')
        if(error)
            error_mesg=error.message
        selectedAyear=dt.find(ob=>ob.is_current==true)
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

        <div class="flex flex-col w-full m-1 bg-gray-100 shadow shadow-gray-400 p-2">
            <p class="text-2xl font-bold text-center bg-white text-slate-800 p-2">Academic Year {selectedAyear?.name}</p>
        </div>
    </div>    
    {#if selectedAyear && collegeList}
        <div class="mt-2 flex justify-center flex-col">
            {#each collegeList as college}   
                <div class="border bg-slate-50 px-2 py-2 text-slate-800 w-full mt-2 text-center text-lg shadow shadow-slate-500 rounded">
                    <h2 class="bg-slate-700 text-white text-lg font-bold uppercase p-2">{college.name}</h2>
                    <div class="flex justify-center md:flex-row md:space-x-4 flex-col">
                        <div class="flex flex-row gap-2 w-full">
                            {#each formList as formType}       

                                <div class="my-2 text-gray-800 w-full p-2 shadow shadow-gray-400 text-center">                            
                                    <h2 class="font-bold text-lg">{formType}</h2>

                                    {#if count}
                                        <p class="font-bold text-xl">
                                            {count[formType]?JSON.parse(count[formType])[college.id]:0}
                                            {#if formType=='Provisional'}=>{count['PROV2MQNRI']?JSON.parse(count['PROV2MQNRI'])[college.id]:0}{/if}
                                        </p>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>




