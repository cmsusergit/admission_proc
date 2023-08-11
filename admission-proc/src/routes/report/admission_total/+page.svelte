<script>
    import { supabase } from '$lib/db'

    import DataTable from '$lib/datatable.svelte'
    import {goto} from '$app/navigation'
    import _ from 'lodash'
    export let data    
    let dataTable,selectedCourse
    let selectedAyear,selectedCollege=1
    import * as XLSX from 'xlsx/xlsx.mjs'
    import { onMount } from 'svelte'
    let loading=false,is_d2d=false

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
    let columnList=[ 
        {name:'Form ID',field:'id',searchable:true},
        {name:'College ID',field:'student_college_id',searchable:true,sortable:true},
        {name:'Student Name',field:'stu_name',searchable:true,sortable:true},   
        {name:'Student Contact',field:'contact',searchable:true,sortable:true},     
        {name:'Student Email',field:'email',searchable:true,sortable:true},     
        {name:'Admission Category',field:'admission_category',selectable:true},
        {name:'Branch',field:'branch',selectable:true},
        {slot:true}
    ],courseList=[]
    $:if(selectedAyear && selectedCourse){
            fetchFeesRecord()
    }     
    const fetchFeesRecord=async()=>{
        if(!selectedAyear || !selectedCourse){
            return
        }
        loading=true        
        let feeCollectionList=[]
        try{            
            let { data:dt, error:dt_err } = await supabase.from('AdmissionFeesCollectionACPC')
            .select(`*`)
            .eq('academic_year',selectedAyear)
            .eq('course',selectedCourse)
            .eq('is_d2d',is_d2d)
            if(dt_err){
                console.log(dt_err)
                return
            }
            else{
                feeCollectionList=dt
            }
            dataTable=[]

            let acpcIdList=[],mqnriIdList=[]
            let vacantIdList=[]
            for (let indx = 0; indx < feeCollectionList.length; indx++) {
                const record = feeCollectionList[indx]
                if(record.form_type=='ACPC' && record.form_id){
                    acpcIdList.push(record.form_id)
                }
                else if(record.form_type=='MQNRI' && record.mqnri_form_id){
                    mqnriIdList.push(record.mqnri_form_id)
                }
                else if(record.form_type=='VACANT' && record.vacant_form_id){                    
                    vacantIdList.push(record.vacant_form_id)
                }
            }
            const formTypeList=[{table:"ACPCFormInfo",list:acpcIdList},{table:"MQNRIFormInfo",list:mqnriIdList},{table:"VacantFormInfo",list:vacantIdList}]
            let templist=[]
            for (let indx = 0; indx < formTypeList.length; indx++) {            
                const tableToFetch = formTypeList[indx].table
                let { data:dtList, error:dt_err1 } = await supabase.from(tableToFetch)
                    .select(`*,Branch(*)`)
                    .in('id',formTypeList[indx].list)
                    .eq('is_removed','False')
                if(dt_err1){
                    console.log(dt_err1)
                    return
                }
                else{
                    dtList.map((record)=>{
                        record['stu_name']=record?.last_name+" "+record?.first_name+" "+record?.middle_name
                        record['admission_category']=record?.admission_category
                        record['branch']=record?.Branch?.name
                        templist.push(record)
                    })
                }
                dataTable=[...templist]//....
                //....

            }
            /*
            let templist=[]
            for (let indx = 0; indx < feeCollectionList.length; indx++) {
                const record = feeCollectionList[indx]
                    if(record.form_type=='ACPC' && record.form_id){
                    f_id=record.form_id
                    tableToFetch='ACPCFormInfo'
                }
                else if(record.form_type=='MQNRI' && record.mqnri_form_id){
                    f_id=record.mqnri_form_id
                    tableToFetch='MQNRIFormInfo'
                }
                else if(record.form_type=='VACANT' && record.vacant_form_id){
                    f_id=record.vacant_form_id
                    tableToFetch='VacantFormInfo'
                }
                let { data:dt, error:dt_err1 } = await supabase.from(tableToFetch)
                    .select(`*,Branch(*)`)
                    .eq('id',f_id).single()
                if(dt_err1){
                    console.log(dt_err1)
                    return
                }
                else{
                    dt['stu_name']=dt?.last_name+" "+dt?.first_name+" "+dt?.middle_name
                    dt['admission_category']=dt?.admission_category
                    dt['branch']=dt?.Branch?.name
                    templist.push(dt)
                }
                dataTable=[...templist]//....
                //....
            }
            */
        }catch(error1){
            console.log('****',error1)
            alert(error1)
        }finally{
            loading=false
        }  
    }   
    onMount(()=>{
        selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id
        fetchCourseList(selectedCollege)       
    })
    const displayRecord=(record)=>{
        goto(`/profile/${record.form_type=='ACPC'?'acpc':'mqnri'}?id=${record.id}`)        
    }
    const fetchCourseList=(value)=>{
        courseList=data?.courseList.filter(ob=>ob.college_id==value)
    }
    const exportToFile=()=>{
            loading=true
            let list1=[]
            let branchList=[]            
            _.forEach(_.uniqBy(dataTable,ob=>ob.branch),ob=>{
                branchList.push(ob.Branch)
            })
            dataTable.forEach((record,indx)=>{
                let temp1={}
                temp1['Sr.']=indx+1
                const dt=new Date(record['dob'])     
                
                temp1['College ID']=record['student_college_id']
                temp1['Student Name']=record['stu_name']                
                temp1['Branch']=record['branch']
                temp1['Admission Category']=record['admission_category']
                temp1['Contact']=record['contact']
                temp1['Email']=record['email']
                temp1['Gender']=record['gender']
                temp1['Category']=record['category']
                temp1['ACPC MeritNumber']=record['acpc_meritnumber']
                temp1['Aadharnumber']=record['aadharnumber']
                temp1['Father Name']=record['father_name']
                temp1['Mother Name']=record['mother_name']
                temp1['Permenant Address']=`${record['per_addr1']},${record['per_addr2']}`
                temp1['Permenant City']=record['per_city']
                temp1['Permenant State']=record['per_state']
                temp1['Permenant Zipcode']=record['per_zipcode']                
                temp1['Present Address']=`${record['present_addr1']},${record['present_addr2']}`
                temp1['Present City']=record['present_city']
                temp1['Present State']=record['present_state']
                temp1['Present Zipcode']=record['present_zipcode']
                temp1['dob']=`${dt.getDate().toString().padStart(2,'0')}-${(dt.getMonth()+1).toString().padStart(2,'0')}-${dt.getFullYear()}`
                temp1['Father Contact']=record['father_contact']
                temp1['Mother Contact']=record['mother_contact']
                list1.push(temp1)
            })
            const wb=XLSX.utils.book_new()             
            const ayear=data?.aYearList.find(ob=>ob.id==selectedAyear)?.name??''
            const college1=data?.collegeList.find(ob=>ob.id==selectedCollege)?.name??''
            const course=data?.courseList.find(ob=>ob.id==selectedCourse)?.name??''
            const merge = [
                {s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },{s: { r: 1, c: 0 }, e: { r: 1, c: 11 } },
            ]
            const filename=`report_${new Date().getDate().toString().padStart(2,0)}_${(new Date().getMonth()+1).toString().padStart(2,0)}`
            branchList.forEach(ob=>{            
                const temp1=list1.filter(tt=>{
                    return tt.Branch.toString().trim()==ob.name.toString().trim()
                })
                const wsheet=XLSX.utils.json_to_sheet([])
                XLSX.utils.sheet_add_aoa(wsheet, [[`${college1}-${ayear}-${course}`]])                
                XLSX.utils.sheet_add_aoa(wsheet, [[`${course}`]],{origin:"A2"})            
                wsheet["!merges"] = merge
                XLSX.utils.sheet_add_json(wsheet,temp1,{origin:"A4"})
                let fname=ob.alias.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                .replace(/\s{2,}/g," ");
                XLSX.utils.book_append_sheet(wb,wsheet,fname.length>28?fname.substr(0,28):fname)
            })
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
                <option value=""></option>
                {#each courseList as course}
                    <option value={course.id}>{course.name}</option>
                {/each}
            </select>
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