<script> 
    import { goto,invalidateAll } from '$app/navigation'

    import { mesg,academicYear,college } from '$lib/store.js'    
    import {  onMount } from 'svelte'
    import DataTable from '$lib/datatable.svelte'
    import Dialog from '$lib/dialog.svelte'
    import _ from 'lodash'
    import {supabase} from '$lib/db'
    import * as XLSX from 'xlsx/xlsx.mjs';
    export let data
    let loading=false

    let dataTable,recordToRemove=-1
    let columnList=[
        {name:'Name',field:'name',searchable:true,sortable:true},
        {name:'Form Number',field:'formnumber',searchable:true,sortable:true},
        {name:'ACPC Number',field:'acpcnumber',searchable:true,sortable:true},
        {name:'ACPC Merit Number',field:'acpc_meritnumber',searchable:true,sortable:true},
        {name:'Contact',field:'contact',searchable:true,sortable:true},
        {name:'Email',sortable:true,field:'email',searchable:true},
        {name:'Amission Category',field:'admission_category',selectable:true,sortable:true},
        {name:'Course',field:'course',selectable:true,sortable:true},
        {name:'Branch',field:'branch',selectable:true,sortable:true},
        {name:'CollegeId',field:'student_college_id',searchable:true,sortable:true},
        {slot:true}
    ]
    $:processData(data)    
    const processData=(data)=>{
        dataTable=_.forEach(data.dataTable,ob=>{
            ob['name']=(ob.title?ob.title:'')+' '+(ob.first_name?ob.first_name:'')+' '+(ob.middle_name?ob.middle_name:'')+' '+(ob.last_name?ob.last_name:'')            
            ob['course']=ob.Course?.name?ob.Course.name.trim():'-'
            ob['branch']=ob.Branch?.name?ob.Branch.name.trim():'-'
            ob['formnumber']=ob.admission_category+ob.form_number[ob.admission_category]   
        })  
        dataTable=_.orderBy(dataTable,['created_at'],['desc'])
    }   
    onMount(()=>{          
        $academicYear=data?.academicYear
        $college=data?.college
    })
    const updateRecord=(record)=>{        
        goto(`/admissionform/acpc?ayear_id=${record.academic_year}&is_update=${record.id}&college_id=${data?.college.id}`)        
    }
    const displayRecord=(record)=>{
        goto(`/profile/acpc?id=${record.id}`)  
    }
    const removeRecord=async()=>{
        const { data, error } = await supabase
            .from('ACPCFormInfo')
            .update({ is_removed: 'True' })
            .eq('id',recordToRemove)
        if(error)
            alert(error.message)
        _.remove(dataTable,ob=>ob.id==recordToRemove)
        invalidateAll()
        $mesg="Record Removed Successfully"
        recordToRemove=-1
        console.log(error);
    }
    const exportToFile=()=>{
            loading=true
            let list1=new Array()            
            dataTable.map(ob=>{
                let temp=_.pick(ob,["id","admission_category","title","first_name","middle_name","last_name","created_at","contact","email",
                
                "gender","dob","course","branch","father_name","father_contact","mother_name","mother_contact","acpcnumber","acpc_merinumber"])
                list1.push(temp)
            })
            const wsheet=XLSX.utils.json_to_sheet(list1)
            const wb=XLSX.utils.book_new()            
            XLSX.utils.book_append_sheet(wb,wsheet,"acpc_info")
            XLSX.writeFile(wb,"acpcforminfo.xlsx")
            loading=false
    }
</script>
<div class="min-h-screen w-full">
    {#if $mesg}
        <div class="w-full flex justify-between p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-emerald-500 text-xl">{$mesg}</div>
            <button on:click={()=>$mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}

    {#if dataTable && dataTable.length>0}
        <div class="mt-2 overflow-auto">

            <div class="flex justify-end">            
                <button on:click={exportToFile} disabled={loading} class="bg-blue-500 p-2 hover:bg-blue-400 w-48 text-white rounded">
                    {#if !loading}Export Excel{:else}Loading....{/if}
                </button>
            </div>
            <DataTable data={dataTable} let:currRecord={record}
                columnlist={columnList}>
                <div slot='action'>
                    <div class="flex justify-center space-x-2 items-center">
                        <button on:click={()=>displayRecord(record)} class="hover:bg-teal-400 bg-teal-500 p-1 text-white rounded">                          
                            <svg width="24" height="24" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"> <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/> <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/> </svg>                                
                        </button>
                        <button on:click={()=>updateRecord(record)} class="hover:bg-amber-400 bg-amber-500 p-1 text-white rounded">
                            
                            <svg width="24" stroke-width="1.5" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 12V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8 10H16M8 6H12M8 14H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16 5.4V2.35355C16 2.15829 16.1583 2 16.3536 2C16.4473 2 16.5372 2.03725 16.6036 2.10355L19.8964 5.39645C19.9628 5.46275 20 5.55268 20 5.64645C20 5.84171 19.8417 6 19.6464 6H16.6C16.2686 6 16 5.73137 16 5.4Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17.9541 16.9394L18.9541 15.9394C19.392 15.5015 20.102 15.5015 20.5399 15.9394V15.9394C20.9778 16.3773 20.9778 17.0873 20.5399 17.5252L19.5399 18.5252M17.9541 16.9394L14.963 19.9305C14.8131 20.0804 14.7147 20.2741 14.6821 20.4835L14.4394 22.0399L15.9957 21.7973C16.2052 21.7646 16.3988 21.6662 16.5487 21.5163L19.5399 18.5252M17.9541 16.9394L19.5399 18.5252" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                        </button>
                        <button on:click={()=>recordToRemove=record.id} class="hover:bg-orange-700 bg-orange-800 p-1 text-white rounded">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17 22H7C5.89543 22 5 21.1046 5 20V7H3V5H7V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H21V7H19V20C19 21.1046 18.1046 22 17 22ZM7 7V20H17V7H7ZM9 4V5H15V4H9ZM15 18H13V9H15V18ZM11 18H9V9H11V18Z" fill="currentColor"/> </svg>
                        </button>
                        <button on:click={()=>{goto(`/feedetail?form_type='acpc'&id=${record.id}`)}} class="hover:bg-emerald-700 bg-emerald-800 p-1 text-white rounded">
                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7-6a1 1 0 0 0 0 2h3c.34 0 .872.11 1.29.412.19.136.372.321.505.588H7.997a1 1 0 1 0 0 2h4.798a1.58 1.58 0 0 1-.504.588A2.352 2.352 0 0 1 11 12H7.997a1 1 0 0 0-.625 1.781l5.003 4a1 1 0 1 0 1.25-1.562L10.848 14h.15c.661 0 1.629-.19 2.46-.789A3.621 3.621 0 0 0 14.896 11H16a1 1 0 1 0 0-2h-1.104a3.81 3.81 0 0 0-.367-1H16a1 1 0 1 0 0-2H8z" clip-rule="evenodd"/></svg>
                        </button>                            
                    </div>
                    </div>            
            </DataTable>
        </div>
    {:else}
        <div class="text-2xl text-orange-800 p-2 text-center">Data Table is empty</div>
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


