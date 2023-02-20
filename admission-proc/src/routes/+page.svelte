<script>
    import { goto } from '$app/navigation'

    import { mesg,college } from '$lib/store.js'    
    import { onMount } from 'svelte';
    import DataTable from '$lib/datatable.svelte'
    export let data
    let dataTable
    let selectedCollege,selectedAyear
    let selectedFormType
    $:{            
        if(selectedCollege){

            dataTable=data.dataTable.filter(ob=>(ob.academic_year==selectedAyear && ob.Course.college_id==selectedCollege))
        }
    }
    const formList=[{name:"ACPC",path:"acpc"},{name:"Provisional",path:"provsional"},{name:"Management/NRI",path:"mqnri"}]
    onMount(()=>{

        dataTable=[...data.dataTable]//....
        selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id//....
        college.set({})
    })
</script>
<div class="min-h-screen w-full">
    {#if $mesg}
        <div class="w-full flex justify-between p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-emerald-500 text-xl">{$mesg}</div>
            <button on:click={()=>$mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}
    <div class="flex justify-between p-1 lg:flex-row flex-col">
        <div class="flex flex-col md:w-1/4 w-full m-1">
            <label for="college" class="text-slate-800 px-1 py-1 font-bold">Select AcademicYear</label>
            <select bind:value={selectedAyear} class="border rounded px-1 py-2 border-blue-400" type="text" id="college" required>
                <option value=""></option>
                {#each data.aYearList as aYear}
                    <option value={aYear.id}>{aYear.name}</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-col md:w-1/2 w-full m-1">
            <label for="college" class="text-slate-800 px-1 py-1 font-bold">Select College</label>            
            <select bind:value={selectedCollege} class="border rounded px-1 py-2 border-blue-400" type="text" id="college" required>
                <option value=""></option>
                {#each data.collegeList as college}
                    <option value={college.id}>{college.name}({college.alias})</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-col md:w-1/4 w-full m-1">
            <label for="formtype" class="text-slate-800 px-1 py-1 font-bold">Select Form</label>
            <select bind:value={selectedFormType} class="border rounded px-1 py-2 border-blue-400" type="text" id="formtype" required>
                <option value=""></option>
                {#if selectedAyear && selectedCollege}
                    {#each formList as formType}
                        <option value={formType.path}>{formType.name}</option>
                    {/each}
                {/if}
            </select>
        </div>
        <div class="flex flex-col md:w-1/4 w-full m-1">
            <div class="h-8 py-1"></div>

            
            
            <button disabled={!selectedFormType | !selectedCollege} on:click={()=>{goto(`/admissionform/${selectedFormType}?ayear_id=${selectedAyear}&college_id=${selectedCollege}`)}} class="px-2 py-2 md:w-48 w-full ml-2 bg-blue-700 text-white hover:bg-blue-500 shadow shadow-blue-400 rounded disabled:bg-gray-400">+New Record</button>            
        </div>
    </div>
    {#if selectedAyear && selectedCollege}
    <div class="mt-2 overflow-auto">
        <DataTable data={dataTable}/>
    </div>
    {/if}
</div>