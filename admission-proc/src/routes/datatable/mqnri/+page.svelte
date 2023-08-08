<script>
    import { goto,invalidateAll } from '$app/navigation'

    import { mesg,academicYear,college } from '$lib/store.js'    
    import {  onMount } from 'svelte'    
    import DataTable from '$lib/datatable.svelte'
    import Modal from '$lib/modal.svelte'
    import Dialog from '$lib/dialog.svelte'
    import _ from 'lodash'
    import {supabase} from '$lib/db'
    import MeritDlg from '$lib/component/mqnri_meritdlg.svelte'
    import * as XLSX from 'xlsx/xlsx.mjs'    

    export let data
    let loading=false,currRecord=null
    let dataTable,recordToRemove=-1
    let role=null,recordToRestore=-1
    let meritRecord=-1,branchList=[]
    let selectedBranch
    let columnList=[
        {name:'Form ID',field:'id',searchable:true,sortable:true},
        {name:'CollegeID',field:'student_college_id',searchable:true,sortable:true},
        {name:'Merit Number',field:'merit_number',sortable:true},
        {name:'Merit Percentile',field:'total_merit'},        
        {name:'ACPC Merit Number',field:'acpc_meritnumber',sortable:true},
        {name:'ACPC Application Number',field:'acpcnumber',sortable:true},
        {name:'Name',field:'name',searchable:true,sortable:true},
        {name:'Contact',field:'contact',searchable:true,sortable:true},
        {name:'Email',sortable:true,field:'email',searchable:true},
        {name:'Amission Category',field:'admission_category',selectable:true,sortable:true},
        {name:'Course',field:'course',selectable:true,sortable:true},
        {name:'Branch',field:'branch',selectable:true,sortable:true},
        {name:'Prov_Branch',field:'prov_branch',selectable:true,sortable:true},
        {slot:true}
    ]
    $:processData(data)    
    $:{
        if(data.session?.user?.user_metadata)
            role=data.session?.user?.user_metadata.role
    }
    const processData=(data)=>{
        dataTable=_.forEach(data.dataTable,ob=>{
                ob['name']=(ob.title?ob.title:'')+' '+(ob.first_name?ob.first_name:'')+' '+(ob.middle_name?ob.middle_name:'')+' '+(ob.last_name?ob.last_name:'')            
                ob['course']=ob.Course?.name?ob.Course.name.trim():'-'
                ob['branch']=ob.Branch?.name?ob.Branch.name.trim():'-'
                ob['prov_branch']=ob.prov_branch?.name?.trim()??'-'
            })         
        dataTable=_.orderBy(dataTable,['total_merit'],['desc'])
        _.forEach(_.filter(dataTable,ob=>ob.admission_category=='M' || ob.admission_category=='B'),(ob,indx)=>{      
            ob['merit_number']=indx+1
        })
        _.forEach(_.filter(dataTable,ob=>ob.admission_category=='N' || ob.admission_category=='B'),(ob,indx)=>{      
            ob['merit_number']=indx+1
        })
    }   
    onMount(()=>{          
        $college=data?.college
        $academicYear=data?.academicYear
    })
    const updateMeritResult=(record)=>{
        console.log('----',record)
        meritRecord=record
    }
    const updateRecord=(record)=>{        
        goto(`/admissionform/mqnri?ayear_id=${record.academic_year}&is_update=${record.id}&college_id=${data?.college.id}`)        
    }
    const displayRecord=(record)=>{
        goto(`/profile/mqnri?id=${record.id}`)  
    }
    const setApproved=async(record,flag)=>{
        console.log('****',record.branch)
        if(!record.branch){
            alert("Please, Select Branch")
            return
        }
        const { data, error } = await supabase
            .from('MQNRIFormInfo')
            .update({ is_approved: flag ,branch:flag==1?record.branch:null})
            .eq('id', record.id)
        if(error)
            alert(error.message)
        else{
            invalidateAll()
            currRecord=null
        }
    }
    const removeRecord=async()=>{
        const { data, error } = await supabase
            .from('MQNRIFormInfo')
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
    const restoreRecord=async()=>{
        const { data, error } = await supabase
            .from('MQNRIFormInfo').update({ is_removed: 'False' })
            .eq('id',recordToRestore)
        if(error)
            alert(error.message)
        invalidateAll()
        $mesg="Record Restored Successfully"
        recordToRestore=-1
        console.log(error);
    }

    

    const exportToFile=()=>{
            loading=true
            let list1=new Array()            
            dataTable.map(ob=>{
                let temp=_.pick(ob,["id","acpcnumber","acpc_meritnumber","student_college_id","admission_category","gender","city","title","first_name","middle_name","last_name","category","dob","email","contact","board_name","exam_seatnumber","entr_examnumber","course","branch","prov_branch","father_name","father_contact","mother_name","mother_contact","present_city","total_merit"])
                list1.push(temp)
            })
            const wsheet=XLSX.utils.json_to_sheet(list1)
            const wb=XLSX.utils.book_new()            
            XLSX.utils.book_append_sheet(wb,wsheet,"prov_info")
            XLSX.writeFile(wb,"provforminfo.xlsx")
    
            loading=false
    }

    const fetchRemovedRecordList=async(is_removed)=>{
        if(is_removed)
            dataTable=_.filter(dataTable,ob=>ob.is_removed)
        else
            processData(data)
    }
    const fetchBranchList=async(course)=>{
        try{
            let { data:dt, error:err1 } = await supabase
                .from('Branch').select(`*`).eq('course_id',course).eq('is_mqnri',true)
            branchList=dt
            if(err1){
                console.log('****',err1)
            }
        }catch(error1){
            console.log('****',error1)            
        }        
    }
</script>
<div class="min-h-screen w-full">
    {#if $mesg}
        <div class="w-full flex justify-between p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-emerald-500 text-xl">{$mesg}</div>
            <button on:click={()=>$mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}    
    <div class="justify-end flex p-2 m-2 space-x-2 items-center border w-full">
        <input on:change={(ee)=>{fetchRemovedRecordList(ee.target.checked)}} type="checkbox" name="show_removed" id="show_removed" class="w-4 h-4"><label class="text-lg font-bold" for="show_removed">Show Only Removed</label>
    </div>
    {#if dataTable && dataTable.length>0}
        {#if currRecord}
            <Modal>                
                <div slot="header">Confirm Branch</div>
                <div slot="content">  
                    <div class="flex flex-col">
                        <label class="font-bold text-sm" for="acpc_meritnumber">Select Branch</label>
                        <div class="px-2 w-full">
                            <select bind:value={selectedBranch} class="w-full border font-normal text-sm px-1 py-1 text-center rounded">
                                {#each branchList as temp}
                                    <option value={temp.id}>{temp.name}</option>
                                {/each}
                            </select>
                        </div>
                    </div>        
                </div>
                <div slot="foot">
                    <div class="">
                        <button type="button" on:click={()=>{currRecord.branch=selectedBranch;setApproved(currRecord,1);}} class="px-2 py-2 bg-blue-500 text-white hover:bg-blue-400 shadow shadow-blue-400 rounded disabled:bg-gray-400 uppercase w-48">submit</button>
                        <button type="button" on:click={()=>{currRecord=null}} class="px-2 py-2 bg-orange-700 text-white hover:bg-orange-500 shadow shadow-orange-400 uppercase rounded disabled:bg-gray-400 w-48">Close</button>
                    </div>
                </div>                           
            </Modal>
        {/if}
        <div class="mt-2 overflow-auto">
            <div class="flex justify-end">            
                <button on:click={exportToFile} disabled={loading} class="bg-blue-500 p-2 hover:bg-blue-400 w-48 text-white rounded">
                    {#if !loading}Export Excel{:else}Loading....{/if}
                </button>
            </div>            
            <DataTable data={dataTable} let:currRecord={record}
                columnlist={columnList}>
                <div slot='action'>
                        {#if role=='admin'}
                            <div class="flex justify-center space-x-2 items-center">
                                <button on:click={()=>displayRecord(record)} class="hover:bg-teal-400 bg-teal-500 p-1 text-white rounded">                          
                                    <svg width="24" height="24" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"> <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/> <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/> </svg>                                
                                </button>
                                <button on:click={()=>updateMeritResult(record)} class="hover:bg-blue-400 bg-blue-500 p-1 text-white rounded">
                                    <svg width="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 30 30.000001" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="id1"><path d="M 5.492188 2.902344 L 24.363281 2.902344 L 24.363281 26.128906 L 5.492188 26.128906 Z M 5.492188 2.902344 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#id1)"><path fill="white" d="M 24.300781 25.355469 L 19.851562 16.890625 C 22.324219 15.730469 23.835938 13.28125 23.835938 10.359375 C 23.835938 5.832031 20.496094 2.902344 15.324219 2.902344 L 6.019531 2.902344 C 5.730469 2.902344 5.492188 3.140625 5.492188 3.429688 L 5.492188 25.601562 C 5.492188 25.890625 5.730469 26.128906 6.019531 26.128906 L 9.6875 26.128906 C 9.976562 26.128906 10.210938 25.890625 10.210938 25.601562 L 10.210938 17.683594 L 14.929688 17.683594 L 19.222656 25.847656 C 19.3125 26.019531 19.492188 26.128906 19.683594 26.128906 L 23.835938 26.128906 C 24.019531 26.128906 24.191406 26.03125 24.285156 25.875 C 24.378906 25.714844 24.386719 25.519531 24.300781 25.355469 Z M 14.941406 13.988281 L 10.210938 13.988281 L 10.210938 6.597656 L 14.84375 6.597656 C 17.5 6.597656 19.121094 8.007812 19.121094 10.300781 C 19.121094 12.640625 17.597656 13.988281 14.941406 13.988281 Z M 14.941406 13.988281 " fill-opacity="1" fill-rule="nonzero"/></g></svg>
                                </button>
                                <button on:click={()=>updateRecord(record)} class="hover:bg-amber-400 bg-amber-500 p-1 text-white rounded">
                                    <svg width="24" stroke-width="1.5" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 12V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8 10H16M8 6H12M8 14H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16 5.4V2.35355C16 2.15829 16.1583 2 16.3536 2C16.4473 2 16.5372 2.03725 16.6036 2.10355L19.8964 5.39645C19.9628 5.46275 20 5.55268 20 5.64645C20 5.84171 19.8417 6 19.6464 6H16.6C16.2686 6 16 5.73137 16 5.4Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17.9541 16.9394L18.9541 15.9394C19.392 15.5015 20.102 15.5015 20.5399 15.9394V15.9394C20.9778 16.3773 20.9778 17.0873 20.5399 17.5252L19.5399 18.5252M17.9541 16.9394L14.963 19.9305C14.8131 20.0804 14.7147 20.2741 14.6821 20.4835L14.4394 22.0399L15.9957 21.7973C16.2052 21.7646 16.3988 21.6662 16.5487 21.5163L19.5399 18.5252M17.9541 16.9394L19.5399 18.5252" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                                </button>
                                {#if !record.is_removed}                     
                                    <button on:click={()=>recordToRemove=record.id} class="hover:bg-orange-700 bg-orange-800 p-1 text-white rounded">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17 22H7C5.89543 22 5 21.1046 5 20V7H3V5H7V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H21V7H19V20C19 21.1046 18.1046 22 17 22ZM7 7V20H17V7H7ZM9 4V5H15V4H9ZM15 18H13V9H15V18ZM11 18H9V9H11V18Z" fill="currentColor"/> </svg>
                                    </button>
                                {:else}
                                    <button on:click={()=>recordToRestore=record.id} class="hover:bg-green-700 bg-green-800 p-1 text-white rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14zM6 7v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm8 7v4h-4v-4H8l4-4 4 4h-2z" fill="currentColor"/></svg>
                                    </button>
                                {/if}
                            
                                
                                {#if record.is_approved==1}
                                    <button on:click={()=>{goto(`/feedetail?form_type='mqnri'&id=${record.id}`)}} class="hover:bg-emerald-700 bg-emerald-800 p-1 text-white rounded">
                                        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7-6a1 1 0 0 0 0 2h3c.34 0 .872.11 1.29.412.19.136.372.321.505.588H7.997a1 1 0 1 0 0 2h4.798a1.58 1.58 0 0 1-.504.588A2.352 2.352 0 0 1 11 12H7.997a1 1 0 0 0-.625 1.781l5.003 4a1 1 0 1 0 1.25-1.562L10.848 14h.15c.661 0 1.629-.19 2.46-.789A3.621 3.621 0 0 0 14.896 11H16a1 1 0 1 0 0-2h-1.104a3.81 3.81 0 0 0-.367-1H16a1 1 0 1 0 0-2H8z" clip-rule="evenodd"/></svg>
                                    </button>
                                    {:else if record.is_approved==0}
                                        <span class="text-sm text-orange-800 p-2 bg-orange-400 rounded-md text-center">Rejected</span>
                                    {:else}
                                        <span class="text-sm text-blue-800 p-2 bg-yellow-200 rounded-md text-center">Pending</span>
                                {/if}
                            </div>
                        {:else}
                            {#if record.is_approved==2}           
                                {#if !record.is_removed}                     
                                    <button on:click={()=>recordToRemove=record.id} class="hover:bg-orange-700 bg-orange-800 p-1 text-white rounded">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17 22H7C5.89543 22 5 21.1046 5 20V7H3V5H7V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H21V7H19V20C19 21.1046 18.1046 22 17 22ZM7 7V20H17V7H7ZM9 4V5H15V4H9ZM15 18H13V9H15V18ZM11 18H9V9H11V18Z" fill="currentColor"/> </svg>
                                    </button>
                                {:else}
                                    <button on:click={()=>recordToRestore=record.id} class="hover:bg-green-700 bg-green-800 p-1 text-white rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14zM6 7v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm8 7v4h-4v-4H8l4-4 4 4h-2z" fill="currentColor"/></svg>
                                    </button>
                                {/if}
                                <button on:click={()=>{currRecord=record;fetchBranchList(record.Course.id);}} class="hover:bg-green-700 bg-green-800 p-2 text-white rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16"> <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/> </svg>
                                </button>
                                <button on:click={()=>setApproved(record,0)} class="hover:bg-orange-700 bg-orange-800 p-2 text-white rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16"> <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/> </svg>
                                </button>
                            {:else}                            
                                <button on:click={()=>setApproved(record,2)} class="hover:bg-yellow-400 bg-yellow-500 p-2 text-white rounded">
                                    Reset
                                    {#if record.is_approved==0}
                                        Rejected
                                    {:else}
                                        Approved
                                    {/if}
                                </button>
                            {/if}
                        {/if}
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
    {#if recordToRestore!=-1}
        <Dialog>
            <div slot="header">Restore Record</div>
            <p slot="content">Do You Really Want To Restore a Record?</p>
            <button on:click={restoreRecord} slot="confirm" class="w-24 px-2 py-1 text-white bg-emerald-500 hover:bg-emerald-400 rounded">Yes</button>                        
            <button on:click={()=>recordToRestore=-1} slot="close" class="w-24 px-2 py-1 text-white bg-red-500 hover:bg-red-400 rounded">No</button>
        </Dialog>
    {/if}
</div>
<div>    
    {#if meritRecord!=-1}
        <MeritDlg meritRecord={meritRecord} on:close={()=>{meritRecord=-1}}/>
    {/if}
</div>

