<script>
    export let data,columnlist
    
    import _ from 'lodash'
    import { onMount } from 'svelte';
    let dataTable
    let sortableField,sortableOrder='asc'
    let selectableColumn={},totalPage=1
    let currPage=1,pageSize=20
    let st,en
    $:dataTable=[...data],currPage=1//....
            //....

    let searchParamList=[]
    $:getSelectableColumnList(data)
    $:st=(currPage-1)*pageSize
    $:en=(currPage-1)*pageSize+pageSize
    $:totalPage=Math.ceil(dataTable.length/pageSize)
    $:{
        if(sortableField){
            dataTable=_.orderBy(dataTable,ob=>ob[sortableField],sortableOrder)
        }
    }
    const getSelectableColumnList=(dt)=>{
        _.forEach(columnlist,column=>{
            if(column.selectable)
                selectableColumn[column.field]=_.uniqBy(dt,ob=>ob[column.field])
        })
    }
    onMount(()=>{        
        getSelectableColumnList(data)
    })
    const handleChange=(event,field)=>{
        const value=event.target.value.trim()
        if(value && field){
            const temp1=searchParamList.find(ob=>ob.field==field)
            if(temp1)
                temp1.value=value
            else
                searchParamList.push({field:field,value:value})
        }
        else{
            _.remove(searchParamList,ob=>ob.field==field)
        }
        console.log('****',searchParamList)
        dataTable=[...data]//....
        //....
        if(searchParamList.length>0){
            dataTable=_.filter(data,ob=>{
                let rr=true
                _.forEach(searchParamList,pp=>{
                    rr=rr & (ob[pp.field].trim()==pp.value)
                })
                return rr
            })
        }
        // else{
        //     dataTable=[...data]//....
        //     //....
        // }
    }
    const handleInput=(event,field)=>{
        if(event.target.value){
            dataTable=_.filter(data,ob=>{ 
                return (''+ob[field])?.toLowerCase().includes(event.target.value.toLowerCase())
            })
        }
        else{
            dataTable=[...data]//....
            //....
        }
    }
</script>
<div>
    {#if data.length<=0}
        <div class="text-2xl text-orange-700 text-center bg-slate-50 p-2">
            Data Table is Empty
        </div>
    {:else}
        <div class="my-4 py-2 px-4 border border-slate-200 w-full flex justify-end items-center">   
            <div class="px-4 font-bold">Page {currPage} / {totalPage}</div>
            <button disabled={currPage==1} on:click={()=>{currPage=currPage-1;currPage=currPage<1?1:currPage}} class="px-2 py-2 mr-2 bg-blue-500 text-white hover:bg-blue-400 shadow shadow-gray-400 rounded w-24 disabled:bg-gray-400">
                <span class="flex justify-around items-center w-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16"> <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/> </svg>Prev</span>
            </button>        
            <button disabled={currPage>=totalPage} on:click={()=>{currPage=(currPage+1)%(totalPage+1)}} class="px-2 py-2 mr-2 bg-blue-500 text-white hover:bg-blue-400 shadow shadow-gray-400 rounded disabled:bg-gray-400 w-24">
                <span class="flex justify-around items-center w-full">Next<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16"> <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/> </svg></span>
            </button>
        </div>
        <div class="overflow-auto text-slate-800">
            <table class="overflow-auto w-full">
                <thead class="border-b border-slate-800">
                    <tr class="bg-slate-200 text-slate-800">                
                        <th class="border border-slate-400 px-1 text-center py-2">Sr.</th>                
                        {#each columnlist as column}                    
                            <th class={`border border-slate-400 text-center py-2 ${column?.class}`}>
                                <div>
                                    {#if column.sortable}
                                        <button on:click={()=>{sortableField=column.field;sortableOrder=sortableOrder=='asc'?'desc':'asc';}} class="w-full px-2">
                                            {column.name?column.name:''} 
                                            {#if sortableOrder=='asc'}&darr;{:else}&uarr;{/if}
                                        </button>
                                    {:else}
                                        <span>{column.name?column.name:''}</span>
                                    {/if}
                                </div>                        
                                {#if column.searchable}
                                    <div class="px-2 w-full">
                                        <input on:input={(event)=>handleInput(event,column.field)} class="w-full border font-normal text-sm px-1 py-1 rounded" type="text">                        
                                    </div>
                                {/if}
                                {#if column.selectable && selectableColumn[column.field]}
                                    <div class="px-2 w-full">
                                        <select on:change={(event)=>{handleChange(event,column.field)}} class="w-full border font-normal text-sm px-1 py-1 text-center rounded">
                                            <option value=""></option>
                                            {#each selectableColumn[column.field] as temp}
                                                <option>{temp[column.field]}</option>
                                            {/each}
                                        </select>
                                    </div>
                                {/if}                        
                            </th>
                        {/each}
                    </tr>
                </thead>                
                {#each _.slice(dataTable,st,en) as record,indx}
                    <tr class="border-b border-slate-800">
                        <td class="border border-slate-400 text-center py-2">{((currPage-1)*pageSize)+indx+1}</td>
                        {#each columnlist as column}
                            {#if !column.slot}
                                <td class={`border border-slate-400 text-center px-2 py-2 ${column?.class}`}>{record[column.field]?record[column.field]:'-'}</td>
                            
                            
                            {:else}
                                <td class={`border border-slate-400 text-center py-2 px-2 ${column?.class}`}>                                                         
                                    <slot currRecord={record} name="action"></slot>
                                </td>

                            {/if}
                        {/each}
                    </tr>
                {/each}  
            </table>
        </div>





        
        <div class="my-4 py-2 px-4 border border-slate-200 w-full flex justify-end items-center">
            <div class="px-4 font-bold">Page {currPage} / {totalPage}</div>
            <button disabled={currPage==1} on:click={()=>{currPage=currPage-1;currPage=currPage<1?1:currPage}} class="px-2 py-2 mr-2 bg-blue-500 text-white hover:bg-blue-400 shadow shadow-gray-400 rounded w-24 disabled:bg-gray-400">
                <span class="flex justify-around items-center w-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16"> <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/> </svg>Prev</span>
            </button>        
            <button disabled={currPage>=totalPage} on:click={()=>{currPage=(currPage+1)%(totalPage+1)}} class="px-2 py-2 mr-2 bg-blue-500 text-white hover:bg-blue-400 shadow shadow-gray-400 rounded disabled:bg-gray-400 w-24">
                <span class="flex justify-around items-center w-full">Next<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16"> <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/> </svg></span>
            </button>
        </div>
    {/if}
</div>

