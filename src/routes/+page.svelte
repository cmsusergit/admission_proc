<script>
    import { goto } from '$app/navigation'

    import { mesg,academicYear,college } from '$lib/store.js'    
    import {  onMount } from 'svelte'
    import _ from 'lodash'
    import {supabase} from '$lib/db'
    export let data
    let selectedAyear,count
    let role=null,provCountByCollege
    const formList=[{name:"ACPC",path:"acpc"},{name:"Provisional",path:"provsional"},{name:"Management/NRI",path:"mqnri"},{name:"Vacant",path:"vacant"}]
    
    
    $:{
        if(data.session?.user?.user_metadata)
        role=data.session?.user?.user_metadata.role
    }
    const fetchCount=async(id)=>{
        if(!id)return
            academicYear.set(selectedAyear)
        const { data:count1, error1 } = await supabase.rpc('fetchcount',{'academicyear_id':id})
        if(error1)    
            alert(error1.message)    
        count=count1
        const {data:dt,error:err1}= await supabase.from('AdmissionFeesCollectionACPC').select('*,Course(*)').eq('academic_year',id)
        if(dt){
            let temp_dt=_.filter(dt,ob=>ob.prov_form_number)
            provCountByCollege=_.countBy(temp_dt,ob=>ob.Course.college_id)            
            console.log('provCountByCollege',provCountByCollege)            
        }
        if(err1){
            console.log('****',err1)            
        }
        
    }
    $:fetchCount(selectedAyear)
    onMount(()=>{
        selectedAyear=data.aYearList.find(ob=>ob.is_current==true).id
        if(typeof window !== 'undefined' && window.localStorage)
            localStorage.setItem('datatable_currPage',1)
        college.set({})
    })
</script>
<div class="min-h-screen w-full">
    {#if $mesg}
        <div class="w-full flex justify-between p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-emerald-500 text-xl">{$mesg}</div>
            <button on:click={()=>$mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}
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
    </div>
    {#if selectedAyear && count}
        <div class="mt-2 flex justify-center flex-col">
            {#each data?.collegeList as college}            
                <div class="border bg-slate-50 px-2 py-2 text-slate-800 w-full mt-2 text-center text-lg shadow shadow-slate-500 rounded">
                    <p class="w-full bg-slate-100 px-2 py-2 mb-2 font-bold text-xl">{college.name} ({college.alias})</p>
                    <div class="flex justify-center md:flex-row md:space-x-4 flex-col">
                        {#each formList as formType}                
                            <div class="bg-blue-500 px-2 py-2 text-white mt-2 w-full">
                                <div class="bg-slate-50 px-2 py-2 text-slate-800">{formType.name}</div>                                
                                <button type="button" on:click={()=>goto(`/datatable/${formType.path}?ayear_id=${selectedAyear}&college_id=${college.id}`)} class="my-2 p-2 border-t border-b w-full hover:bg-blue-700">
                                    {count[formType.name]?JSON.parse(count[formType.name])[college.id]:0}
                                    {#if formType.path=='provsional'}
                                        =>{count['PROV2MQNRI']?JSON.parse(count['PROV2MQNRI'])[college.id]:0}
                                        {#if provCountByCollege}
                                            <b>[{(count[formType.name]?JSON.parse(count[formType.name])[college.id]:0)-(provCountByCollege[college.id]??0)}]</b>
                                        {/if}
                                    {/if}
                                    {#if formType.path=='mqnri'}=>{count['MQNRIDONE']?JSON.parse(count['MQNRIDONE'])[college.id]:0}{/if}
                                </button><br/>  
                                {#if role=='admin'}
                                    <button on:click={()=>goto(`/admissionform/${formType.path}?ayear_id=${selectedAyear}&college_id=${college.id}`)} class="border-t border-b mx-auto p-2 mb-2 hover:bg-blue-700 shadow-white w-full">
                                        +New Record
                                    </button>
                                {/if}
                            </div>  
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>


