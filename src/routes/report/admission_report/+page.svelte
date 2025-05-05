<script>
    import { supabase } from '$lib/db'

    import DataTable from '$lib/datatable.svelte'
    import {goto} from '$app/navigation'
    import _ from 'lodash'
    export let data    
    let branchList,countbybranch
    let selectedAyear,selectedCollege=1
    import * as XLSX from 'xlsx/xlsx.mjs'
    import { onMount } from 'svelte'
    let loading=false,is_d2d=false

    const fetchCountByBranch=async(id,branchlist)=>{
        console.log(id,branchList)        
        if(!id)return
        const { data:count1, error1 } = await supabase.rpc('countbybranch',{'academicyear_id':id})
        if(error1)    
            alert(error1.message)
        countbybranch=count1
        const formList=["ACPC","Provisional","Management/NRI","Vacant"]
        let temp1=[]
        _.forEach(formList,formType=>{            
            _.forEach(branchlist,branch=>{            
                const ob=JSON.parse(countbybranch[formType])

                console.log(branch.Course?.college_id,selectedCollege)
                if(branch.Course?.college_id==selectedCollege){
                    temp1.push({branch:branch,college:branch.Course?.College?.alias,formType:formType,course:branch.Course?.alias,count:ob[branch.id]??'-'})
                }
            })
        })
        countbybranch=[]
        const tt=_.groupBy(temp1,"college")
        _.forEach(tt,(el,ob) => {
            countbybranch.push({college:ob,dt:_.groupBy(el,ob=>ob.formType)})
        })
    }    
    $:fetchCountByBranch(selectedAyear,branchList)
    onMount(async()=>{
        selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id
        let { data: Branch, error } = await supabase
        .from('Branch')
        .select('*,Course(*)')
        if (error) console.error(error)
        else {
            branchList=Branch
        }
        fetchCountByBranch(selectedAyear,branchList)
    })
    // const convertToDtstring = (dt,addt)=>{             
    //     dt.setDate(dt.getDate()+addt)
    //     let day = '' + dt.getDate()
    //     let month = '' + (dt.getMonth() + 1)   
    //     let year = dt.getFullYear()
    //     if (month.length < 2) 
    //         month = '0' + month;
    //     if (day.length < 2) 
    //         day = '0' + day;
    //     return [year, month, day].join('-');
    // }
    // let from_dt=convertToDtstring(new Date(),0),to_dt=convertToDtstring(new Date(),1)
    // let columnList=[
    //     {name:'Reciept Number',field:'reciept_number',searchable:true,sortable:true},
    //     {name:'College ID',field:'stu_college_id',searchable:true,sortable:true},
    //     {name:'Name',field:'stu_name',searchable:true,sortable:true},
    //     {name:'Reciept Date',field:'reciept_date'},
    //     {name:'Cash Amount',field:'cash_amount'},
    //     {name:'DD/Cheque Amount',field:'dd_amount'},
    //     {name:'Online Amount',field:'online_amount'},
    //     {name:'ACPC Amount',field:'ACPC_amount'},
    //     {name:'Total Amount',field:'total_amount'},
    //     {name:"Comment",field:'comment'},
    //     {slot:true}
    // ],courseList=[]
    // $:processData(dataTable)
    // $:if(selectedAyear && selectedCourse && from_dt && to_dt){
    //         fetchFeesRecord()
    // }     
    // const fetchFeesRecord=async()=>{
    //     if(!selectedAyear || !selectedCourse || !from_dt || !to_dt){
    //         return
    //     }
    //     loading=true
    //     let { data:dt, error:dt_err } = await supabase.from('AdmissionFeesCollectionACPC')
    //         .select(`*`)
    //         .eq('academic_year',selectedAyear)
    //         .eq('course',selectedCourse)
    //         .eq('is_d2d',is_d2d)
    //         .gte('created_at', from_dt)
    //         .lte('created_at', to_dt)
    //     if(dt_err){
    //         console.log(dt_err)
    //         alert(dt_err.messaage)
    //         return
    //     }
    //     else{
    //         dataTable=dt
    //     }   
    //     loading=false
    // }   
    // const processData=(dataTable)=>{
    //     dataTable=_.forEach(dataTable,ob=>{

    //         const dt=new Date(ob['reciept_date'])
    //         ob['reciept_date']=`${dt.getDate().toString().padStart(2,'0')}-${(dt.getMonth()+1).toString().padStart(2,'0')}-${dt.getFullYear()}`
    //         ob['total_amount']=(ob['cash_amount']??0)+(ob['dd_amount']??0)+(ob['online_amount']??0)+(ob['ACPC_amount']??0)
    //     })         
    // }   
    // onMount(()=>{
    //     selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id
    //     fetchCourseList(selectedCollege)
    // })
    // const displayRecord=(record)=>{
    //     goto(`/profile/${record.form_type=='ACPC'?'acpc':'mqnri'}?id=${record.form_type=='ACPC'?record.form_id:record.mqnri_form_id}`)        
    // }
    // const fetchCourseList=(value)=>{
    //     courseList=data?.courseList.filter(ob=>ob.college_id==value)
    // }
    // const exportToFile=()=>{
    //         loading=true
    //         let list1=[]
    //         let cashTotal=0.0
    //         let ddTotal=0.0
    //         let onlineTotal=0.0
    //         let acpcTotal=0.0
    //         let total=0.0
    //         dataTable.forEach((record,indx)=>{
    //             let temp1={}
    //             temp1['Sr.']=indx+1
    //             temp1['Rec. Number']=record['reciept_number']
    //             // const dt=new Date(record['reciept_date'])
    //             // temp1['Rec. Date']=`${dt.getDate().toString().padStart(2,'0')}-${(dt.getMonth()+1).toString().padStart(2,'0')}-${dt.getFullYear()}`
    //             temp1['Rec. Number. Date']=record['reciept_date']
    //             temp1['College ID']=record['stu_college_id']
    //             temp1['Student Name']=record['stu_name']                
    //             temp1['Cash Amount']=record['cash_amount']
    //             cashTotal+=record['cash_amount']
    //             temp1['DD/Cheque Amount']=record['dd_amount']
    //             ddTotal+=record['dd_amount']
    //             temp1['Online Amount']=record['online_amount']
    //             onlineTotal+=record['online_amount']
    //             temp1['ACPC Amount']=record['ACPC_amount']
    //             acpcTotal+=record['ACPC_amount']
    //             temp1['Total Amount']=record['total_amount']
    //             total+=record['total_amount']
    //             temp1['Comment']=record['comment']
    //             list1.push(temp1)

    //         })
    //         list1.push({'Cash Amount':cashTotal,'DD/Cheque Amount':ddTotal,'Online Amount':onlineTotal,'ACPC Amount':acpcTotal,'Total Amount':total})
    //         const wb=XLSX.utils.book_new()     
    //         const wsheet=XLSX.utils.json_to_sheet([])
    //         const ayear=data?.aYearList.find(ob=>ob.id==selectedAyear)?.name??''
    //         const college1=data?.collegeList.find(ob=>ob.id==selectedCollege)?.name??''
    //         XLSX.utils.sheet_add_aoa(wsheet, [[`${college1}-${ayear}`]])
    //         XLSX.utils.sheet_add_aoa(wsheet, [[`${is_d2d?'D2D-':''}From Date:${from_dt} To Date:${to_dt}`]],{origin:"A2"})            
    //         XLSX.utils.sheet_add_json(wsheet,list1,{origin:"A4"})
    //         const merge = [
    //             {s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },{s: { r: 1, c: 0 }, e: { r: 1, c: 11 } },
    //         ]
    //         wsheet["!merges"] = merge
    //         const filename=`report_${new Date().getDate().toString().padStart(2,0)}_${(new Date().getMonth()+1).toString().padStart(2,0)}`
    //         XLSX.utils.book_append_sheet(wb,wsheet,filename)
    //         XLSX.writeFile(wb,`${filename}.xlsx`)
    //         loading=false    
    // }
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
            <select on:change={()=>fetchCountByBranch(selectedAyear,branchList)} bind:value={selectedCollege} class="border rounded px-1 py-2 border-blue-400" type="text" id="college" required>
                <option value=""></option>
                {#each data.collegeList as college}
                    <option value={college.id}>{college.name}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="flex md:flex-row flex-col w-full">
        {#if countbybranch}
            {#each countbybranch as college}
            <div class="flex flex-col w-full m-1 bg-gray-100 p-2">
                {#each Object.entries(college?.dt) as branch,value}
                    <div class="flex flex-row w-full bg-gray-100 p-2">                                    
                        <p class="bg-blue-700 text-white px-2 py-2 w-full uppercase font-bold">{branch[0]}</p>
                    </div>
                    <div class="flex flex-col w-full bg-gray-100 p-2">
                        <table>
                            <thead>
                                <th class="bg-blue-500 text-white border text-center px-4 py-2">Branch Name</th>
                                <th class="bg-blue-500 text-white border text-center px-4 py-2">Count</th>
                            </thead>
                            {#each Object.entries(_.groupBy(branch[1], 'branch.Course.id')) as [courseId, groupedRecords]}                                                                
                                <tr class="border text-white bg-slate-400 font-bold">
                                    <td class="text-lg text-left px-4 py-1">
                                        {groupedRecords?.[0].branch.Course.name} 
                                    </td>
                                    <td class="text-lg text-center px-4 py-1">
                                        {_.sumBy(groupedRecords,rr=>Number.parseInt(rr.count))}
                                    </td>
                                </tr>
                                {#each _.sortBy(groupedRecords, record => record.branch?.name) as record1}
                                    <tr>
                                        <td class="border text-center text-lg py-1">{record1.branch?.name} ({record1.branch?.alias})</td>
                                        <td class="border text-center text-lg py-1">{record1.count}</td>
                                    
                                    </tr>
                                {/each}                                    
                            {/each}
                        </table>
                    </div>
                {/each}
            </div>
            {/each}            
        {/if}
    </div>
    <!--<div class="flex md:flex-row flex-col w-full">
        <div class="flex flex-col w-full md:w-1/2 m-1 px-1">
            <label for="course" class="text-slate-800 px-1 py-1 font-bold">D2d Admission</label>
            <div class="flex flex-row border border-blue-400 p-2 rounded">
                <input type="checkbox" bind:checked={is_d2d} on:change={()=>fetchFeesRecord()} class="text-slate-800 border w-4 p-2" id="mq"/><label class="text-slate-800 mx-2 font-bold px-2" for="mq">Is D2D?</label>
            </div>
        </div>
        <div class="flex flex-col w-full m-1">
            <label for="course" class="text-slate-800 px-1 py-1 font-bold">Select Course</label>
            <select bind:value={selectedCourse} class="border rounded px-1 py-2 border-blue-400" type="text" id="course" required>
                <option value=""></option>
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
        {/if} -->
</div>