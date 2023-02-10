<script>
    import { goto } from '$app/navigation'

    import { college } from '$lib/store.js'    
    import { onMount } from 'svelte';
    import DataTable from '$lib/datatable.svelte'
    export let data
    let selectedCollege,selectedAyear
    let selectedFormType
    $:{
        if(selectedFormType)
            goto(`/admissionform/${selectedFormType}?ayear_id=${selectedAyear}&college_id=${selectedCollege}`)

    }
    const formList=[{name:"ACPC",path:"acpc"},{name:"Provisional",path:"provsional"},{name:"Management/NRI",path:"mqnri"}]
    onMount(()=>{
        selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id
        college.set({})
    })
</script>
<div class="min-h-screen w-full">
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
    </div>

    <div class="mt-2 overflow-auto">
        <DataTable/>
    </div>
</div>