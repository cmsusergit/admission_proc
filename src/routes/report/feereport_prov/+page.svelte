<script>
    import { supabase } from '$lib/db'

    import DataTable from '$lib/datatable.svelte'
    import {goto} from '$app/navigation'
    import _ from 'lodash'
    export let data    
    let dataTable,selectedCourse=-1
    let selectedAyear,selectedCollege=1
    import * as XLSX from 'xlsx/xlsx.mjs'
    import { onMount } from 'svelte'
    let loading=false,is_d2d=false

    const convertToDtstring = (dt,addt)=>{             
        dt.setDate(dt.getDate()+addt)
        let day = '' + dt.getDate()
        let month = '' + (dt.getMonth() + 1)   
        let year = dt.getFullYear()
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        return [year, month, day].join('-');
    }
    let from_dt=convertToDtstring(new Date(),0),to_dt=convertToDtstring(new Date(),1)
    let columnList=[
        {name:'Form Number',field:'form_number',searchable:true,sortable:true},
        {name:'Name',field:'name',searchable:true,sortable:true},
        {name:'Email',field:'email',searchable:true},
        {name:'Contact',field:'contact',searchable:true},        
        {name:'Amount',field:'amount'},
        {name:'TXN-Number',field:'txn_number',searchable:true},
        {name:'Collected On',field:'collected_on',searchable:true,sortable:true},
        {name:'Branch',field:'branch',selectable:true,sortable:true},
        {slot:true}
    ],courseList=[]
    $:processData(dataTable)
    $:if(selectedAyear && selectedCourse && from_dt && to_dt && selectedCollege){
            fetchFeesRecord()
    }     
    const fetchFeesRecord=async()=>{
        if(!selectedAyear || !selectedCourse || !from_dt || !to_dt){
            return
        }
        loading=true
        // let { data:dt, error:dt_err } = await supabase.from('ProvFormInfo')
        //     .select(`*,ProvAdmissionFee(*),Branch(*)`)
        //     .eq('academic_year',selectedAyear)
        //     .eq('course',selectedCourse)
        //     .eq('is_d2d',is_d2d)                    
        let query = supabase.from('ProvFormInfo').select(`*,ProvAdmissionFee(*),Course(*),Branch(*)`)
            .eq('academic_year',selectedAyear).eq('is_d2d',is_d2d)
        if(selectedCourse && selectedCourse!=-1)
            query =query.eq('course',selectedCourse)        
        let { data:dt, error:dt_err } =await query
        if(dt_err){
            console.log(dt_err)
            alert(dt_err.messaage)
            return
        }
        else{
            dataTable=dt
            dataTable=_.filter(dataTable,ob=>{
                let ob1_1=ob['ProvAdmissionFee'][0]
                if(!ob1_1)
                    return false
                return (new Date(ob1_1['collected_on'])>=new Date(from_dt) && new Date(ob1_1['collected_on'])<=new Date(to_dt) && ob1_1['college_id']==selectedCollege)  
            })
        }   
        loading=false
    }   
    const processData=(dataTable)=>{
        dataTable=_.forEach(dataTable,async(ob)=>{
            if(ob['ProvAdmissionFee'] && ob['ProvAdmissionFee'].length>0){
                let dt=ob['ProvAdmissionFee'][0]
                if(dt?.collected_on){
                    let dt_temp1=new Date(dt?.collected_on)                    
                    ob['collected_on']=`${dt_temp1.getFullYear()}-${(dt_temp1.getMonth()+1).toString().padStart(2,'0')}-${dt_temp1.getDate().toString().padStart(2,'0')}`
                }
                else
                    ob['collected_on']='-'
                ob['form_number']=ob?.form_number??'-'
                ob['name']=(ob?.title??'')+(ob?.first_name+' '??' ')+(ob?.middle_name+' '??' ')+(ob?.last_name+' '??' ')
                ob['amount']=dt?.amount??0.0
                ob['txn_number']=dt?.txn_number??'-'
                ob['branch']=ob['Branch']?.name??'-'                
            }
        })         
    }   
    onMount(()=>{
        selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id
        fetchCourseList(selectedCollege)
    })
    const displayRecord=(record)=>{
        goto(`/profile/provsional?id=${record.id}`)        
    }
    const fetchCourseList=(value)=>{
        courseList=data?.courseList.filter(ob=>ob.college_id==value)
    }
    const exportToFile=()=>{
            loading=true
            let list1=[]
            let total=0.0
            dataTable.forEach((record,indx)=>{
                let temp1={}
                temp1['Sr.']=indx+1
                temp1['Form Number']=record.form_number
                temp1['Name']=record.name
                temp1['Email']=record.email
                temp1['Contact']=record.contact
                temp1['Branch']=record.branch
                temp1['Collected On']=record.collected_on

                temp1['TXN-Number']=record.txn_number
                temp1['Amount']=record.amount
                total+=record.amount
                list1.push(temp1)
            })
            list1.push({'Amount':total})
            const wb=XLSX.utils.book_new()     
            const wsheet=XLSX.utils.json_to_sheet([])
            const ayear=data?.aYearList.find(ob=>ob.id==selectedAyear)?.name??''
            const college1=data?.collegeList.find(ob=>ob.id==selectedCollege)?.name??''
            XLSX.utils.sheet_add_aoa(wsheet, [[`${college1}-${ayear}`]])
            XLSX.utils.sheet_add_aoa(wsheet, [[`${is_d2d?'D2D-':''}From Date:${from_dt} To Date:${to_dt}`]],{origin:"A2"})            
            XLSX.utils.sheet_add_json(wsheet,list1,{origin:"A4"})
            const merge = [
                {s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },{s: { r: 1, c: 0 }, e: { r: 1, c: 11 } },
            ]
            wsheet["!merges"] = merge
            const filename=`report_${new Date().getDate().toString().padStart(2,0)}_${(new Date().getMonth()+1).toString().padStart(2,0)}`
            XLSX.utils.book_append_sheet(wb,wsheet,filename)
            XLSX.writeFile(wb,`${filename}.xlsx`)
            loading=false    

    }
</script>
<div class="">
    <div class="flex justify-between p-1 lg:flex-row flex-col">
        <div class="flex flex-col w-full m-1">
            <label for="college" class="text-slate-800 px-1 py-1 font-bold">Select AcademicYear</label>
            <select bind:value={selectedAyear} class="border rounded px-1 py-2 border-blue-400" id="college" required>
                <option value=""></option>
                {#each data.aYearList as aYear}
                    <option value={aYear.id}>{aYear.name}</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-col w-full m-1">
            <label for="college" class="text-slate-800 px-1 py-1 font-bold">Select AcademicYear</label>
            <select on:change={(ee)=>{fetchCourseList(ee.target.value);}} bind:value={selectedCollege} class="border rounded px-1 py-2 border-blue-400" type="text" id="college" required>
                <option value=""></option>
                {#each data.collegeList as college}
                    <option value={college.id}>{college.name}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="flex md:flex-row flex-col w-full">
        <div class="flex flex-col w-full md:w-1/2 m-1 px-1">
            <label for="course" class="text-slate-800 px-1 py-1 font-bold">D2d Admission</label>
            <div class="flex flex-row border border-blue-400 p-2 rounded">
                <input type="checkbox" bind:checked={is_d2d} on:change={()=>fetchFeesRecord()} class="text-slate-800 border w-4 p-2" id="mq"/><label class="text-slate-800 mx-2 font-bold px-2" for="mq">Is D2D?</label>
            </div>
        </div>
        <div class="flex flex-col w-full m-1">
            <label for="course" class="text-slate-800 px-1 py-1 font-bold">Select Course</label>
            <select bind:value={selectedCourse} class="border rounded px-1 py-2 border-blue-400" type="text" id="course" required>
                <option value="-1"></option>
                {#each courseList as course}
                    <option value={course.id}>{course.name}</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-col w-full md:w-1/2 m-1 px-1">
            <label for="from_dt" class="text-slate-800 px-1 py-1 font-bold">From Date</label>
            <input bind:value={from_dt} type="date" class="border rounded px-1 py-1 border-blue-400" name="from_dt" id="from_dt">
        </div>        
        <div class="flex flex-col w-full md:w-1/2 m-1 px-1">
            <label for="to_dt" class="text-slate-800 px-1 py-1 font-bold">To Date</label>
            <input bind:value={to_dt} type="date" class="border rounded px-1 py-1 border-blue-400" name="to_dt" id="to_dt">
        </div>
    </div>
    {#if loading}
        <p class="text-4xl text-orange-700 text-center p-2">Loading....</p>
    {/if}

    <div class="w-full mb-2 border flex justify-end space-x-2 p-2">
        <div class="w-2 bg-slate-400 border text-white"></div>
        <button on:click={exportToFile} class="button-primary md:w-48">Export Excel</button>
    </div>
    {#if dataTable}
        <div class="flex flex-col justify-between md:flex-row">
            <p class="text-2xl bg-slate-400 text-center text-white p-2 border w-full">Total Matches Found {dataTable.length}</p>            
        </div>
        <DataTable data={dataTable} let:currRecord={record}
            columnlist={columnList}>
            <div slot='action'>
                <div class="flex justify-center space-x-2 items-center">
                    <button on:click={()=>displayRecord(record)} class="hover:bg-teal-400 bg-teal-500 p-1  text-white rounded">
                            Profile
                    </button>
                </div>
            </div>            
        </DataTable>    
        {/if}
</div>