<script>
    import { supabase } from '$lib/db'

    import DataTable from '$lib/datatable.svelte'
    import {goto} from '$app/navigation'
    export let data    
    let dataTable,dataTable_provonly
    let dataTable_mqnrionly
    let selectedAyear,selectedCollege=1
    import * as XLSX from 'xlsx/xlsx.mjs';
    import _ from 'lodash'
    import { onMount } from 'svelte';

    let loading=false,isMQNRIOrProv=0
    let columnList=[
        {name:'Name',field:'name',searchable:true,sortable:true},
        {name:'Provsional ID',field:'prov_id',searchable:true,sortable:true},
        {name:'MQNRI ID',sortable:true,field:'mqnri_id',searchable:true},
        {name:'Prov Contact',field:'prov_contact',searchable:true,sortable:true},
        {name:'MQNRI Contact',field:'mqnri_contact',searchable:true,sortable:true},
        {name:'Prov Email',field:'prov_email',searchable:true,sortable:true},    
        {name:'MQNRI Email',sortable:true,field:'mqnri_email',searchable:true},
        {slot:true}
    ]
    let columnList_provonly=
    [
        {name:'Name',field:'name',searchable:true,sortable:true},
        {name:'ID',field:'id',searchable:true,sortable:true},
        {name:'Contact',field:'contact',searchable:true,sortable:true},
        {name:'Email',field:'email',searchable:true,sortable:true},  
        {name:'Course',field:'course',selectable:true,sortable:true},
        {name:'Branch',field:'branch',selectable:true,sortable:true},
        {slot:true}
    ]
    let columnList_mqnrionly=
    [
        {name:'Name',field:'name',searchable:true,sortable:true},
        {name:'ID',field:'id',searchable:true,sortable:true},
        {name:'Contact',field:'contact',searchable:true,sortable:true},
        {name:'Email',field:'email',searchable:true,sortable:true},    
        {slot:true}
    ]
    $:processData(dataTable)
    $:processDataProvOnly(dataTable_provonly)
    $:processDataMQNRIOnly(dataTable_mqnrionly)
    $:if(selectedAyear && selectedCollege){
            fetchProvMQNRIDt()
    }    

    const fetchProvMQNRIDt=async()=>{
        loading=true
        let { data:dt, error:dt_err } = await supabase
            .from('prov_mqnri')
            .select(`*`)
            .filter('academic_year','eq',selectedAyear)
            .filter('college_id','eq',selectedCollege)
        if(dt_err){
            console.log(dt_err)
            alert(dt_err.messaage)
            return
        }
        else{
            dataTable=dt
        }        
        let { data:dtprov, error } = await supabase
        .from('prov_without_mqnri')
        .select(`*,Course(*),Branch(*)`)
        .filter('academic_year','eq',selectedAyear)
        if (error){
            console.error(error)
            alert(error.messaage)
            return
        }
        else {
            dataTable_provonly=dtprov.filter(ob=>ob.Course.college_id==selectedCollege)
        }

        let { data:dtmqnri, error1 } = await supabase
        .from('mqnri_without_prov')
        .select(`*,Course(*)`)
        .filter('academic_year','eq',selectedAyear)
        if (error1){
            console.error(error1)
            alert(error1.messaage)
            return
        }
        else {
            dataTable_mqnrionly=dtmqnri.filter(ob=>ob.Course.college_id==selectedCollege)
        }
        loading=false
    }
    const processDataProvOnly=(dataTable)=>{
        dataTable=_.forEach(dataTable,ob=>{
            ob['name']=(ob.title?ob.title:'')+' '+(ob.first_name?ob.first_name:'')+' '+(ob.middle_name?ob.middle_name:'')+' '+(ob.last_name?ob.last_name:'')            
            ob['course']=ob.Course?.alias
            ob['branch']=ob.Branch?.alias
        })         
    }   

    const processDataMQNRIOnly=(dataTable)=>{
        dataTable=_.forEach(dataTable,ob=>{
            ob['name']=(ob.title?ob.title:'')+' '+(ob.first_name?ob.first_name:'')+' '+(ob.middle_name?ob.middle_name:'')+' '+(ob.last_name?ob.last_name:'')            
        })         
    }   
    const processData=(dataTable)=>{
        dataTable=_.forEach(dataTable,ob=>{
            ob['name']=(ob.title?ob.title:'')+' '+(ob.first_name?ob.first_name:'')+' '+(ob.middle_name?ob.middle_name:'')+' '+(ob.last_name?ob.last_name:'')            
        })         
    }   
    onMount(()=>{
        selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id
    })

    const displayRecord=(record,type)=>{
        if(type=='p')
            goto(`/profile/provsional?id=${record.prov_id}`)        
        else
            goto(`/profile/mqnri?id=${record.mqnri_id}`)
    }
    const displayRecord1=(record)=>{
        goto(`/profile/provsional?id=${record.id}`)        
    }

    const exportToFile=()=>{
            loading=true
            let list1= isMQNRIOrProv==0?dataTable:(isMQNRIOrProv==1?dataTable_provonly:dataTable_mqnrionly)
            console.log(list1)
            const wb=XLSX.utils.book_new()      
            const wsheet=XLSX.utils.json_to_sheet(list1)
            const filename=isMQNRIOrProv==0?'MQNRI&PROVBOTH':(isMQNRIOrProv==1?'PROV_ONLY':'MQNRI_ONLY')
            XLSX.utils.book_append_sheet(wb,wsheet,filename)
            XLSX.writeFile(wb,`${filename}.xlsx`)
            loading=false




            
    }
</script>
<div class="">
    <div class="flex justify-between p-1 lg:flex-row flex-col">
        <div class="flex flex-col w-full m-1">
            <label for="college" class="text-slate-800 px-1 py-1 font-bold">Select AcademicYear</label>
            <select bind:value={selectedAyear} class="border rounded px-1 py-2 border-blue-400" type="text" id="college" required>
                <option value=""></option>
                {#each data.aYearList as aYear}
                    <option value={aYear.id}>{aYear.name}</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-col w-full m-1">
            <label for="college" class="text-slate-800 px-1 py-1 font-bold">Select AcademicYear</label>
            <select bind:value={selectedCollege} class="border rounded px-1 py-2 border-blue-400" type="text" id="college" required>
                <option value=""></option>
                {#each data.collegeList as college}
                    <option value={college.id}>{college.name}</option>
                {/each}
            </select>
        </div>
    </div>
    {#if loading}
    <p class="text-4xl text-orange-700 text-center p-2">Loading....</p>
    {/if}
    <div class="w-full mb-2 border flex justify-end space-x-2 p-2">
        <div class="flex items-center"><input bind:group={isMQNRIOrProv} value="0" type="radio" class="border w-4 p-2" id="ismqnriprov0"/><label class="mx-2 font-bold" for="ismqnriprov0">Provisional & MQNRI Both</label></div>
        <div class="flex items-center"><input bind:group={isMQNRIOrProv} value="1" type="radio" class="border w-4 p-2" id="ismqnriprov1"/><label class="mx-2 font-bold" for="ismqnriprov1">Provisional Forms Without MQNRI</label></div>
        <div class="flex items-center"><input bind:group={isMQNRIOrProv} value="2" type="radio" class="border w-4 ml-5 p-2" id="ismqnriprov2"/><label class="mx-2 font-bold" for="ismqnriprov2">MQNRI Forms Without Provisional</label></div>
        <div class="w-2 bg-slate-400 border text-white"></div>
        <button on:click={exportToFile} class="button-primary md:w-48">Export Excel</button>
    </div>
    
    {#if isMQNRIOrProv==0  && dataTable}
        <div class="flex flex-col justify-between md:flex-row">
            <p class="text-2xl bg-slate-400 text-center text-white p-2 border w-full">Total Matches Found {dataTable.length}</p>            
        </div>
        <DataTable data={dataTable} let:currRecord={record}
                    columnlist={columnList}>
                    <div slot='action'>
                            <div class="flex justify-center space-x-2 items-center">
                                <button on:click={()=>displayRecord(record,'p')} class="hover:bg-teal-400 bg-teal-500 p-1 w-8 text-white rounded">
                                        P
                                </button>
                                <button on:click={()=>displayRecord(record,'mqnri')} class="hover:bg-teal-400 bg-teal-500 p-1 text-white rounded">
                                    MQNRI
                                </button>
                            </div>
                        </div>            
        </DataTable>
    {:else if isMQNRIOrProv==1 && dataTable_provonly}
        <p class="text-2xl bg-slate-400 text-center text-white p-2 border">Total Matches Found {dataTable_provonly.length}</p>
        <DataTable data={dataTable_provonly} let:currRecord={record}
                    columnlist={columnList_provonly}>
                    <div slot='action'>
                            <div class="flex justify-center space-x-2 items-center">
                                <button on:click={()=>displayRecord1(record)} class="hover:bg-teal-400 bg-teal-500 p-1 w-8 text-white rounded">
                                        P
                                </button>
                            </div>
                        </div>            
        </DataTable>
    {:else if isMQNRIOrProv==2 && dataTable_mqnrionly}
        <p class="text-2xl bg-slate-400 text-center text-white p-2 border">Total Matches Found {dataTable_mqnrionly.length}</p>
        <DataTable data={dataTable_mqnrionly} let:currRecord={record}
            columnlist={columnList_mqnrionly}>
            <div slot='action'>
                    <div class="flex justify-center space-x-2 items-center">
                        <button on:click={()=>displayRecord1(record)} class="hover:bg-teal-400 bg-teal-500 p-1 text-white rounded">
                            MQNRI
                        </button>
                    </div>


            </div>            
        </DataTable>
    {/if}
</div>