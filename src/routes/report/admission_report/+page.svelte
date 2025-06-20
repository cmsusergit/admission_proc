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
    let provAdmissionCount=0

    const fetchProvCount=async(id,branchList)=>{
        if(!id)return        
        const {data:dt,error:err1}= await supabase.from('AdmissionFeesCollectionACPC').select('*,Course(*)').eq('academic_year',id)
        if(dt){
            let temp_dt=_.filter(dt,ob=>ob.prov_form_number)            
            provAdmissionCount=_.countBy(temp_dt,ob=>ob.branch)
        }        
        if(err1){
            console.log('****',err1)            
        }
        provAdmissionCount= provAdmissionCount || 0
        console.log('provAdmissionCount',provAdmissionCount)        
    }
    const fetchCountByBranch=async(id,branchlist)=>{
        if(!id)return
        const { data:count1, error1 } = await supabase.rpc('countbybranchv_1',{'academicyear_id':id,'is_d2d_flag':is_d2d})
        if(error1)    
            alert(error1.message)
        countbybranch=count1
        const formList=["ACPC","Provisional","Management/NRI","Vacant"]
        let temp1=[]
        _.forEach(formList,formType=>{            
            _.forEach(branchlist,branch=>{            
                const ob=JSON.parse(countbybranch[formType])
                if(branch.Course?.college_id==selectedCollege){
                    temp1.push({branch:branch,college:branch.Course?.College?.alias,formType:formType,course:branch.Course?.alias,count:ob[branch.id]??'-'})
                }
            })
        })
        countbybranch=[]
        const tt=_.groupBy(temp1,ob=>ob.course)
        _.forEach(tt,(el,ob)=>{
            countbybranch.push({course:ob,dt:_.groupBy(el,ob=>ob.branch?.name)})
        })
    }
    $:if(is_d2d){
        fetchCountByBranch(selectedAyear,branchList)
    }
    $:fetchCountByBranch(selectedAyear,branchList)
    onMount(async()=>{
        selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id
        let { data: Branch, error } = await supabase
        .from('Branch')
        .select('*,Course(*)').order('name', { ascending: true })
        if (error) console.error(error)
        else {
            branchList=Branch
        }
        fetchCountByBranch(selectedAyear,branchList)



        fetchProvCount(selectedAyear,branchList)
    })
    const exportToFile=()=>{
            loading=true
            /*
            let list1=[]
            list1.push({'Cash Amount':cashTotal,'DD/Cheque Amount':ddTotal,'Online Amount':onlineTotal,'ACPC Amount':acpcTotal,'Total Amount':total})
            */
            const wb=XLSX.utils.book_new()     
            const wsheet=XLSX.utils.json_to_sheet([])
            const ayear=data?.aYearList.find(ob=>ob.id==selectedAyear)?.name??''
            const college1=data?.collegeList.find(ob=>ob.id==selectedCollege)?.name??''
            XLSX.utils.sheet_add_aoa(wsheet, [[`${college1}-${ayear}`]])
            let list1=[]
            countbybranch.forEach(record1=> {
                record1.dt=_.map(record1.dt,ob=>{                    
                    list1.push({course:record1.course,branch:"",formType:"",count:""})
                    _.map(ob,(ob1,indx)=>{  
                        list1.push({course:"",branch:ob1.branch?.name,formType:ob1.formType,count:ob1.count})
                    })
                    list1.push({course:record1.course,branch:"",formType:'Total',count:_.sumBy(ob,ob2=>Number.parseInt(ob2.count)),'ProvCount':provAdmissionCount[ob[0]?.branch?.id]??'-'})
                    list1.push({course:"",branch:"",formType:"",count:""})
                })
            })
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
            <select on:change={()=>fetchCountByBranch(selectedAyear,branchList)} bind:value={selectedCollege} class="border rounded px-1 py-2 border-blue-400" type="text" id="college" required>
                <option value=""></option>
                {#each data.collegeList as college}
                    <option value={college.id}>{college.name}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="border-t border-b px-2 mt-2 bg-gray-100 border-blue-500 py-2">  
        <input bind:checked={is_d2d} on:change={(ee)=>{fetchCountByBranch(selectedAyear,branchList)}} type="checkbox" class="border w-4 p-2" id="sameaddr"><label class="mx-2 font-bold" for="sameaddr">Is D2D</label>
    </div>            
    <div>
        <div class="justify-end flex px-2 py-2">  
            <button on:click={exportToFile} class="bg-blue-700 text-white px-4 py-2 hover:bg-blue-500 rounded-md">Export Excel</button>
        </div>
    </div>

    <div class="flex md:flex-row flex-col w-full">
        {#if countbybranch}
            {#each countbybranch as college}
                <div class="flex flex-col w-full m-1 bg-gray-100 p-2">
                    <div class="flex flex-row w-full bg-gray-100">                    
                        <p class="bg-slate-700 text-white px-2 w-full uppercase font-bold text-center">{college.course}</p>                
                    </div>
                    {#each Object.values(college?.dt) as rr,indx}
                        <div class="bg-teal-700 text-white px-2 pb-2 w-full uppercase font-bold text-center">                            
                            <div class="px-2 py-1">{rr[0].branch?.name} <b>({_.sumBy(rr,ob=>Number.parseInt(ob.count))})</b></div>
                            {#each rr as temp1}
                                <div class="flex flex-row w-full bg-gray-100 p-1">                                    
                                    <p class="bg-blue-700 text-white px-1 w-full uppercase font-bold text-center">{temp1.formType}</p>
                                    <p class="bg-blue-700 text-white px-1 w-1/4 uppercase font-bold text-center">{temp1.count}</p>
                                    {#if temp1.formType=='Provisional' && provAdmissionCount && provAdmissionCount[temp1.branch.id]}        
                                        <p class="bg-blue-700 text-white px-1 w-1/4 uppercase font-bold text-center">
                                            {temp1.count-provAdmissionCount[temp1.branch.id]}
                                        </p>
                                    {:else}
                                        <p class="bg-blue-700 text-white px-1 w-1/4 uppercase font-bold text-center">-</p>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {/each}
                </div>
            {/each}             
        {/if}
    </div>
</div>



