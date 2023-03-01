<script>
    import { goto,invalidateAll } from '$app/navigation'

    import { mesg,college } from '$lib/store.js'    
    import {  onMount } from 'svelte'
    import DataTable from '$lib/datatable.svelte'
    import Dialog from '$lib/dialog.svelte'
    import _ from 'lodash'
    import {supabase} from '$lib/db'
    export let data
    let dataTable,recordToRemove=-1
    let selectedCollege=1,selectedAyear=1

    let columnList=[
        {name:'Name',field:'name',searchable:true,sortable:true},
        {name:'Contact',field:'contact',searchable:true,sortable:true},
        {name:'Email',sortable:true,field:'email',searchable:true},
        {name:'Course',field:'course',selectable:true,sortable:true},
        {name:'Branch',field:'branch',selectable:true,sortable:true},
        {slot:true}
    ]
    $:{            
        if(selectedCollege){
            dataTable=data.dataTable.filter(ob=>(ob.academic_year==selectedAyear && ob.Course.college_id==selectedCollege))
        }else{
            dataTable=data.dataTable
        }
    }
    const formList=[{name:"ACPC",path:"acpc"},{name:"Provisional",path:"provsional"},{name:"Management/NRI",path:"mqnri"}]
    onMount(()=>{
        dataTable=_.forEach(data.dataTable,ob=>{
            ob['name']=(ob.title?ob.title:'')+' '+(ob.first_name?ob.first_name:'')+' '+(ob.middle_name?ob.middle_name:'')+' '+(ob.last_name?ob.last_name:'')            
            ob['course']=ob.Course.name.trim()
            ob['branch']=ob.Branch.name.trim()
        })         
    })
    const updateRecord=(id)=>{        
        if(selectedAyear && selectedCollege)

            goto(`/admissionform/provsional?ayear_id=${selectedAyear}&is_update=${id}&college_id=${selectedCollege}`)        
        else
            $mesg='Please, Select College To Perform Update Operation on a Record'
    }
    const removeRecord=async()=>{
        const { data, error } = await supabase
            .from('ProvFormInfo')
            .delete()
            .eq('id',recordToRemove)
        if(error)
            alert(error.message)
        _.remove(dataTable,ob=>ob.id==recordToRemove)
        invalidateAll()
        console.log(dataTable)
        $mesg="Record Removed Successfully"
        recordToRemove=-1
        console.log(error);
    }
</script>

<div class="min-h-screen w-full">
    {#if $mesg}
        <div class="w-full flex justify-between p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-emerald-500 text-xl">{$mesg}</div>
            <button on:click={()=>$mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}
    {#if selectedAyear}
    <div class="mt-2 overflow-auto">
        <DataTable data={dataTable} let:currRecord={record}
            columnlist={columnList}>
            <div slot='action'>
                <div class="flex justify-center space-x-2 items-center">


                    <button on:click={()=>updateRecord(record.id)} class="hover:bg-amber-400 bg-amber-500 p-1 text-white rounded">
                        <svg width="24" stroke-width="1.5" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 12V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8 10H16M8 6H12M8 14H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16 5.4V2.35355C16 2.15829 16.1583 2 16.3536 2C16.4473 2 16.5372 2.03725 16.6036 2.10355L19.8964 5.39645C19.9628 5.46275 20 5.55268 20 5.64645C20 5.84171 19.8417 6 19.6464 6H16.6C16.2686 6 16 5.73137 16 5.4Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17.9541 16.9394L18.9541 15.9394C19.392 15.5015 20.102 15.5015 20.5399 15.9394V15.9394C20.9778 16.3773 20.9778 17.0873 20.5399 17.5252L19.5399 18.5252M17.9541 16.9394L14.963 19.9305C14.8131 20.0804 14.7147 20.2741 14.6821 20.4835L14.4394 22.0399L15.9957 21.7973C16.2052 21.7646 16.3988 21.6662 16.5487 21.5163L19.5399 18.5252M17.9541 16.9394L19.5399 18.5252" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                    </button>
                    <button on:click={()=>recordToRemove=record.id} class="hover:bg-orange-700 bg-orange-800 p-1 text-white rounded">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17 22H7C5.89543 22 5 21.1046 5 20V7H3V5H7V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H21V7H19V20C19 21.1046 18.1046 22 17 22ZM7 7V20H17V7H7ZM9 4V5H15V4H9ZM15 18H13V9H15V18ZM11 18H9V9H11V18Z" fill="currentColor"/> </svg>
                    </button>
                    <button on:click={()=>removeRecord(record.id)} class="hover:bg-emerald-700 bg-emerald-800 p-1 text-white rounded">
                        
                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7-6a1 1 0 0 0 0 2h3c.34 0 .872.11 1.29.412.19.136.372.321.505.588H7.997a1 1 0 1 0 0 2h4.798a1.58 1.58 0 0 1-.504.588A2.352 2.352 0 0 1 11 12H7.997a1 1 0 0 0-.625 1.781l5.003 4a1 1 0 1 0 1.25-1.562L10.848 14h.15c.661 0 1.629-.19 2.46-.789A3.621 3.621 0 0 0 14.896 11H16a1 1 0 1 0 0-2h-1.104a3.81 3.81 0 0 0-.367-1H16a1 1 0 1 0 0-2H8z" clip-rule="evenodd"/></svg>
                    </button>
                </div>
            </div>            
        </DataTable>
    </div>
    {/if}
</div>



<div>
    {#if recordToRemove!=-1}
        <Dialog>
            <div slot="header">Remove Record</div>
            <p slot="content">Do You Really Want To Remove a Record?</p>
            <button on:click={removeRecord} slot="confirm" class="w-24 px-2 py-1 text-white bg-emerald-500 hover:bg-emerald-400 rounded">Yes</button>                        
            <button on:click={()=>recordToRemove=-1} slot="close" class="w-24 px-2 py-1 text-white bg-red-500 hover:bg-red-400 rounded">No</button>
        </Dialog>
    {/if}
</div>


