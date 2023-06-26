<script>
    import { supabase } from '$lib/db'

    import {invalidateAll } from '$app/navigation'
    import DataTable from '$lib/datatable.svelte'
    import FeeSubschemeDlg from '$lib/component/feesubschemedlg.svelte'
    export let data    
    let dataTable,feesRecord
    let selectedAyear,selectedCollege=1
    import _ from 'lodash'
    import { onMount } from 'svelte'
    import Dialog from '$lib/dialog.svelte'

    let loading=false,formDlgOpen=false
    let mesg,error_mesg
    let recordToRemove=-1
    let columnList=[
        {name:'Name',field:'name',searchable:true,sortable:true},
        {name:'Amount',field:'amount'},
        {name:'Fees category',sortable:true,field:'fees_category_name',selectable:true},
        {name:'Fees Scheme',field:'fees_scheme_name',selectable:true,sortable:true},
        {name:'Course',field:'course_name',selectable:true,sortable:true},
        {slot:true}
    ]
    $:if(selectedAyear && selectedCollege){
        fetchDt()
    }   
    onMount(()=>{
        selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id
    })  
    const fetchDt=async()=>{
        loading=true
        let { data:dt, error:err1 } = await supabase
            .from('AdmissionSubFeesInfo').select(`*,AdmissionFeesCategory(*),AdmissionFeesScheme(*),Course(*)`)
            .eq('academic_year',selectedAyear)
        if(err1)
        {
            console.log(err1)
            dataTable=[]
            loading=false
            return
        }
        else{
            dataTable=dt.filter(ob=>ob.Course.college_id==selectedCollege)
            dataTable?.forEach(ob=>{
                ob['fees_category_name']=ob.AdmissionFeesCategory.name
                ob['fees_scheme_name']=ob.AdmissionFeesScheme.name
                ob['course_name']=ob.Course?.alias
            })
        }
        loading=false        
}
const removeRecord=async()=>{
    const { data, error } = await supabase
        .from('AdmissionSubFeesInfo')
        .delete()
        .eq('id',recordToRemove)
    
    if(error){
        mesg=''
        error_mesg=error.message
        invalidateAll()
        return
    }
    mesg="Successfully Removed"
    recordToRemove=-1
}
const insertRecord=async(record)=>{
        try{
            loading = true
            const { data:dt, error:err1 } = await supabase
            .from('AdmissionSubFeesInfo')
            .upsert(record)
            .select('id')
            console.log(dt,err1)
            if(err1)
            {
                error_mesg=error.message     
                window.scrollTo(0,50)
                if(err1 instanceof Error){
                    error_mesg=err1.message
                    mesg=''
                }
                return
            }
            else{                
                error_mesg=''
                mesg='Form Record Inserted/Updated Successully.'    
                invalidateAll()
            }            
        } catch (error) {
            error_mesg=error.message
            window.scrollTo(0,50)
            mesg=''
            return
        } finally {
            loading = false
            formDlgOpen=false
        }
    }
const handleSubmit=(record)=>{
    const dt=_.omit(record.detail,['AdmissionFeesCategory','AdmissionFeesScheme','Course','fees_category_name','course_name','fees_scheme_name'])
    dt['academic_year']=selectedAyear
    insertRecord(dt)
    invalidateAll()
}
</script>
<div class="bg-white w-full">    
    {#if mesg}
        <div id="errormesg" class="w-full flex justify-between mt-2 mb-4 p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-green-800 text-xl">{mesg}</div>
            <button on:click={()=>mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}    
    {#if error_mesg}
        <div id="errormesg" class="w-full flex justify-between mt-2 mb-4 p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-orange-800 text-xl">{error_mesg}</div>
            <button on:click={()=>error_mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}      
    {#if loading}<p class="text-orange-500 text-center p-2 text-2xl">Loading....</p>{/if}
    <div class="flex justify-between p-4 lg:flex-row flex-col border-b">
        <div class="flex flex-col w-full m-1">
            <label for="college" class="text-slate-800 px-1 py-1 font-bold">Select AcademicYear</label>
            <select bind:value={selectedAyear} class="border rounded px-1 py-2 border-blue-400" type="text" id="college" required>
                {#each data.aYearList as aYear}
                    <option value={aYear.id}>{aYear.name}</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-col w-full m-1">
            <label for="college" class="text-slate-800 px-1 py-1 font-bold">Select AcademicYear</label>
            <select bind:value={selectedCollege} class="border rounded px-1 py-2 border-blue-400" type="text" id="college" required>
                {#each data.collegeList as college}
                    <option value={college.id}>{college.name}</option>
                {/each}
            </select>
        </div>
    </div>
    {#if formDlgOpen}
        <div class="my-2 w-full">        
            <FeeSubschemeDlg on:close={()=>{
                formDlgOpen=false
            }}
            on:submit={(record)=>{
                handleSubmit(record)
            }}        
            recordDt={feesRecord}
            academic_year={selectedAyear}
            feesCategoryList={data?.feesCategoryList} 
            courseList={data?.courseList} feeSchemeList={data?.feesSchemeList}></FeeSubschemeDlg>
        </div>
    {/if}
    {#if loading}
        <p class="text-4xl text-orange-700 text-center p-2">Loading....</p>
    {/if}    
    {#if !formDlgOpen}
        <div class="flex justify-end p-2 mt-2 w-full">
            <button on:click={()=>{formDlgOpen=true}} class="w-48 button-primary">AddRecord</button>
        </div>
    {/if}
    {#if dataTable && dataTable.length>0}
        <DataTable data={dataTable} let:currRecord={record}
                    columnlist={columnList}>
            <div class="flex justify-center space-x-2 items-center" slot="action">
                <button on:click={()=>{feesRecord=record;formDlgOpen=true;}} class="hover:bg-amber-400 bg-amber-500 p-1 text-white rounded">
                    <svg width="24" stroke-width="1.5" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 12V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8 10H16M8 6H12M8 14H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16 5.4V2.35355C16 2.15829 16.1583 2 16.3536 2C16.4473 2 16.5372 2.03725 16.6036 2.10355L19.8964 5.39645C19.9628 5.46275 20 5.55268 20 5.64645C20 5.84171 19.8417 6 19.6464 6H16.6C16.2686 6 16 5.73137 16 5.4Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17.9541 16.9394L18.9541 15.9394C19.392 15.5015 20.102 15.5015 20.5399 15.9394V15.9394C20.9778 16.3773 20.9778 17.0873 20.5399 17.5252L19.5399 18.5252M17.9541 16.9394L14.963 19.9305C14.8131 20.0804 14.7147 20.2741 14.6821 20.4835L14.4394 22.0399L15.9957 21.7973C16.2052 21.7646 16.3988 21.6662 16.5487 21.5163L19.5399 18.5252M17.9541 16.9394L19.5399 18.5252" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                </button>
                <button on:click={()=>{recordToRemove=record.id}} class="hover:bg-orange-700 bg-orange-800 p-1 text-white rounded">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17 22H7C5.89543 22 5 21.1046 5 20V7H3V5H7V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H21V7H19V20C19 21.1046 18.1046 22 17 22ZM7 7V20H17V7H7ZM9 4V5H15V4H9ZM15 18H13V9H15V18ZM11 18H9V9H11V18Z" fill="currentColor"/> </svg>
                </button>
            </div>
        </DataTable>
        {:else}    
        <p class="text-orange-700 text-2xl text-center p-2">
            Table Empty
        </p>
        {/if}
        {#if recordToRemove!=-1}
            <Dialog>
                <div slot="header">Remove Record</div>
                <p slot="content">Do You Really Want To Remove a Record?</p>
                <button on:click={removeRecord} slot="confirm" class="w-24 px-2 py-1 text-white bg-emerald-500 hover:bg-emerald-400 rounded">Yes</button>                        
                <button on:click={()=>recordToRemove=-1} slot="close" class="w-24 px-2 py-1 text-white bg-red-500 hover:bg-red-400 rounded">No</button>
            </Dialog>
        {/if}
</div>



