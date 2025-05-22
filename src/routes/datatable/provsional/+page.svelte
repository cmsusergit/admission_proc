<script>
    import { goto,invalidateAll } from '$app/navigation'

    import { mesg,academicYear,college } from '$lib/store.js'    
    import {  onMount } from 'svelte'    
    import DataTable from '$lib/datatable.svelte'
    import Dialog from '$lib/dialog.svelte'
    import _ from 'lodash'
    import {supabase} from '$lib/db'
    import Provfeecollection from '$lib/component/provfeecollection.svelte';
    import * as XLSX from 'xlsx/xlsx.mjs';


    export let data
    let is_include_removed=false,isReference=-1
    let loading=false,branchList=[]
    let dataTable,recordToRemove=-1
    let collectFeeRecord=-1,role=null
    let reference_name=''
    let columnList=[
        {name:'ID',field:'id',searchable:true,sortable:true},
        {name:'Form Number',field:'form_number',searchable:true,sortable:true},
        {name:'Name',field:'name',searchable:true,sortable:true},
        {name:'Contact',field:'contact',searchable:true,sortable:true},
        {name:'Email',sortable:true,field:'email',searchable:true},
        {name:'Course',field:'course',selectable:true,sortable:true},
        {name:'Branch',field:'branch',selectable:true,sortable:true},
        {name:'Reference Name',field:'reference_name',searchable:true,sortable:true},
        {name:'Is D2D?',field:'isd2d',selectable:true,sortable:true},
        {slot:true}
    ]
    $:processData(data,is_include_removed)    
    $:{
        if(data.session?.user?.user_metadata)
            role=data.session?.user?.user_metadata.role
    }
    const processData=(data,is_include_removed)=>{
        dataTable=_.forEach(data.dataTable,ob=>{
            ob['name']=(ob.title?ob.title:'')+' '+(ob.first_name?ob.first_name:'')+' '+(ob.middle_name?ob.middle_name:'')+' '+(ob.last_name?ob.last_name:'')            
            ob['course']=ob.Course?.name?ob.Course.name.trim():'-'
            ob['branch']=ob.Branch?.name?ob.Branch.name.trim():'-'
            ob['isd2d']=ob.is_d2d?'Y':'N'
        })        
        branchList=[]
        _.forEach(_.uniqBy(dataTable,ob=>ob.branch),ob=>{
            branchList.push(ob.Branch)
        })
        dataTable=dataTable.filter(ob=>ob.is_removed==is_include_removed)
        dataTable=_.orderBy(dataTable,['created_at'],['desc'])
    }   
    onMount(()=>{          
        $college=data?.college
        $academicYear=data?.academicYear
    })
    const updateRecord=(record)=>{        
        goto(`/admissionform/provsional?ayear_id=${record.academic_year}&is_update=${record.id}&college_id=${data?.college.id}`)        
    }
    const displayRecord=(record)=>{
        goto(`/profile/provsional?id=${record.id}`)        
    }
    const setApproved=async(record,flag)=>{
        const user_id=data?.session.user.id
        const { data1, error } = await supabase
            .from('ProvFormInfo')
            .update({ is_approved: flag,approved_by:user_id })

            .eq('id', record.id)
        if(error)
            alert(error.message)
        else
            invalidateAll()
    }
    const editReferenceName=async()=>{
        const { data, error } = await supabase
            .from('ProvFormInfo')
            .update({ reference_name: reference_name })
            .eq('id', isReference)
        if(error)
            alert(error.message)
        else{
            invalidateAll()
            alert("Reference Name Updated Successfully")
            isReference=-1
        }
    }
    const removeRecord=async()=>{
        const { data, error } = await supabase
            .from('ProvFormInfo')
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
                let temp=_.omit(ob,["academic_year","is_removed","is_approved","is_d2d","name","approved_by","Course","Branch","Brach"])
                list1.push(temp)
            })
            const wb=XLSX.utils.book_new()        
            branchList.forEach(ob=>{            
                const temp1=list1.filter(tt=>tt.branch==ob.name)
                console.log(temp1);
                const wsheet=XLSX.utils.json_to_sheet(temp1)
                let fname=ob.alias.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                .replace(/\s{2,}/g," ")

                XLSX.utils.book_append_sheet(wb,wsheet,fname.length>28?fname.substr(0,28):fname)
            })
            XLSX.writeFile(wb,"provforminfo.xlsx")
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
            <div class="flex flex-col w-full m-1 px-1">
                <div class="flex flex-row p-2 w-full justify-end rounded">
                    <input type="checkbox" bind:checked={is_include_removed} class="border w-4 p-2" id="mq"/><label class="mx-2 font-bold" for="mq">Show Removed?</label>
                </div>
            </div>
            <DataTable data={dataTable} let:currRecord={record}
                columnlist={columnList}>
                <div slot='action'>
                    {#if role=='admin'}
                        <div class="flex justify-center space-x-2 items-center">
                            <button on:click={()=>displayRecord(record)} class="hover:bg-teal-400 bg-teal-500 p-1 text-white rounded">
                                <svg width="24" height="24" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"> <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/> <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/> </svg>                                
                            </button>
                            <button on:click={()=>updateRecord(record)} class="hover:bg-amber-400 bg-amber-500 p-1 text-white rounded">
                                <svg width="24" stroke-width="1.5" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 12V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8 10H16M8 6H12M8 14H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16 5.4V2.35355C16 2.15829 16.1583 2 16.3536 2C16.4473 2 16.5372 2.03725 16.6036 2.10355L19.8964 5.39645C19.9628 5.46275 20 5.55268 20 5.64645C20 5.84171 19.8417 6 19.6464 6H16.6C16.2686 6 16 5.73137 16 5.4Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17.9541 16.9394L18.9541 15.9394C19.392 15.5015 20.102 15.5015 20.5399 15.9394V15.9394C20.9778 16.3773 20.9778 17.0873 20.5399 17.5252L19.5399 18.5252M17.9541 16.9394L14.963 19.9305C14.8131 20.0804 14.7147 20.2741 14.6821 20.4835L14.4394 22.0399L15.9957 21.7973C16.2052 21.7646 16.3988 21.6662 16.5487 21.5163L19.5399 18.5252M17.9541 16.9394L19.5399 18.5252" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                            </button>
                            {#if record.is_removed==false}
                                <button on:click={()=>recordToRemove=record.id} class="hover:bg-orange-700 bg-orange-800 p-1 text-white rounded">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17 22H7C5.89543 22 5 21.1046 5 20V7H3V5H7V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H21V7H19V20C19 21.1046 18.1046 22 17 22ZM7 7V20H17V7H7ZM9 4V5H15V4H9ZM15 18H13V9H15V18ZM11 18H9V9H11V18Z" fill="currentColor"/> </svg>
                                </button>
                            {:else}
                                <p class="bg-orange-500 text-white px-1 py-1">REMOVED</p>
                            {/if}
                            {#if record.is_approved==1}
                                <button on:click={()=>{collectFeeRecord=record}} class="hover:bg-emerald-700 bg-emerald-800 p-1 text-white rounded">
                                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7-6a1 1 0 0 0 0 2h3c.34 0 .872.11 1.29.412.19.136.372.321.505.588H7.997a1 1 0 1 0 0 2h4.798a1.58 1.58 0 0 1-.504.588A2.352 2.352 0 0 1 11 12H7.997a1 1 0 0 0-.625 1.781l5.003 4a1 1 0 1 0 1.25-1.562L10.848 14h.15c.661 0 1.629-.19 2.46-.789A3.621 3.621 0 0 0 14.896 11H16a1 1 0 1 0 0-2h-1.104a3.81 3.81 0 0 0-.367-1H16a1 1 0 1 0 0-2H8z" clip-rule="evenodd"/></svg>
                                </button>
                                {:else if record.is_approved==0}
                                    <span class="text-sm text-orange-800 p-2 bg-orange-400 rounded-md text-center">Rejected</span>
                                {:else}

                                    <span class="text-sm text-blue-800 p-2 bg-yellow-200 rounded-md text-center">Pending</span>
                            {/if}
                            <button on:click={()=>isReference=record.id} class="hover:bg-yellow-400 bg-yellow-500 p-1 text-white rounded">
                                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000">
                                        <path d="M1780 4275 c-85 -19 -229 -91 -305 -152 -116 -94 -213 -245 -252 -393 -24 -88 -23 -281 1 -370 57 -211 208 -393 401 -485 93 -44 178 -65 287 -72 l88 -6 0 59 c0 101 0 100 -94 107 -146 10 -269 68 -376 176 -67 68 -114 145 -146 241 -29 84 -26 263 5 350 61 173 195 310 367 372 72 26 234 36 316 19 73 -15 180 -68 246 -120 45 -36 112 -115 147 -175 9 -16 16 -15 78 13 37 17 67 36 67 42 0 28 -87 144 -155 207 -90 83 -160 126 -272 165 -77 27 -104 31 -213 34 -83 2 -147 -2 -190 -12z"/>
                                        <path d="M2969 3798 c-376 -33 -708 -325 -801 -704 -30 -124 -30 -304 0 -428 75 -303 304 -558 592 -658 200 -69 449 -66 640 9 341 134 571 452 587 815 6 132 -6 233 -41 336 -143 420 -530 670 -977 630z m279 -173 c210 -49 409 -209 507 -408 102 -208 102 -466 -1 -675 -97 -199 -294 -356 -511 -409 -102 -24 -267 -22 -368 6 -284 79 -498 302 -555 583 -25 117 -25 199 -1 313 77 370 414 631 786 609 44 -3 108 -11 143 -19z"/>
                                        <path d="M1314 2892 c-242 -145 -422 -359 -519 -616 -26 -70 -75 -257 -75 -287 0 -13 17 -19 72 -27 40 -6 76 -8 79 -4 3 4 14 45 23 92 52 253 219 517 408 644 l51 35 66 -51 c143 -110 313 -168 490 -168 101 1 185 11 198 23 3 3 -2 38 -12 77 l-18 72 -51 -8 c-219 -30 -406 29 -561 177 -45 44 -84 79 -86 78 -2 0 -32 -17 -65 -37z"/>
                                        <path d="M1130 1888 c-208 -198 -314 -307 -313 -318 1 -10 14 -43 27 -74 l25 -56 131 0 c96 0 131 -3 134 -12 23 -87 66 -208 96 -268 114 -226 318 -405 583 -510 73 -28 254 -80 281 -80 6 0 24 32 40 71 26 65 27 73 12 81 -43 24 -149 124 -191 180 -104 138 -148 261 -180 495 l-5 42 132 3 131 3 28 68 28 67 -315 303 c-174 166 -319 303 -322 304 -4 2 -149 -133 -322 -299z m515 -103 l190 -184 -112 -1 -113 0 0 -70 c0 -241 62 -485 163 -642 20 -32 34 -58 32 -58 -3 0 -31 13 -63 29 -131 66 -270 198 -347 329 -50 85 -100 230 -117 336 l-12 76 -99 0 c-54 0 -97 4 -95 9 4 10 371 361 378 361 3 0 91 -83 195 -185z"/>
                                        <path d="M2285 2034 c-98 -60 -216 -147 -254 -188 l-25 -26 54 -55 53 -54 71 58 c72 58 160 121 170 121 3 0 40 -28 83 -63 204 -164 482 -247 733 -217 224 26 372 91 575 254 l35 29 68 -46 c339 -227 524 -568 549 -1014 l6 -113 -1006 0 -1007 0 0 -75 0 -75 1079 0 1079 0 6 23 c3 12 6 71 6 130 1 602 -255 1057 -753 1337 l-57 32 -88 -83 c-91 -86 -186 -149 -282 -187 -319 -126 -673 -49 -921 198 -38 39 -73 70 -77 69 -4 0 -47 -25 -97 -55z"/>
                                    </g>
                                </svg>
                            </button>
                        </div>
                        {:else}
                            {#if record.is_approved==2}
                                <button on:click={()=>setApproved(record,1)} class="hover:bg-green-700 bg-green-800 p-2 text-white rounded">
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
                            <button on:click={()=>displayRecord(record)} class="hover:bg-teal-400 bg-teal-500 p-1 text-white rounded">
                                <svg width="24" height="24" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"> <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/> <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/> </svg>                                
                            </button>
                            <button on:click={()=>updateRecord(record)} class="hover:bg-amber-400 bg-amber-500 p-1 text-white rounded">
                                <svg width="24" stroke-width="1.5" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 12V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8 10H16M8 6H12M8 14H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16 5.4V2.35355C16 2.15829 16.1583 2 16.3536 2C16.4473 2 16.5372 2.03725 16.6036 2.10355L19.8964 5.39645C19.9628 5.46275 20 5.55268 20 5.64645C20 5.84171 19.8417 6 19.6464 6H16.6C16.2686 6 16 5.73137 16 5.4Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17.9541 16.9394L18.9541 15.9394C19.392 15.5015 20.102 15.5015 20.5399 15.9394V15.9394C20.9778 16.3773 20.9778 17.0873 20.5399 17.5252L19.5399 18.5252M17.9541 16.9394L14.963 19.9305C14.8131 20.0804 14.7147 20.2741 14.6821 20.4835L14.4394 22.0399L15.9957 21.7973C16.2052 21.7646 16.3988 21.6662 16.5487 21.5163L19.5399 18.5252M17.9541 16.9394L19.5399 18.5252" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                            </button>
                            {#if record.is_removed==false}
                                <button on:click={()=>recordToRemove=record.id} class="hover:bg-orange-700 bg-orange-800 p-1 text-white rounded">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17 22H7C5.89543 22 5 21.1046 5 20V7H3V5H7V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H21V7H19V20C19 21.1046 18.1046 22 17 22ZM7 7V20H17V7H7ZM9 4V5H15V4H9ZM15 18H13V9H15V18ZM11 18H9V9H11V18Z" fill="currentColor"/> </svg>
                                </button>
                            {:else}
                                <p class="bg-orange-500 text-white px-1 py-1">REMOVED</p>
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
</div>
<div>    
    {#if collectFeeRecord!=-1}
        <Provfeecollection collectFeeRecord={collectFeeRecord} on:close={()=>{collectFeeRecord=-1}}/>
    {/if}
</div>
<div>
    {#if isReference!=-1}
        <Dialog>
            <div slot="header">Reference Name</div>
            <div slot="content">

                <label for="rname">Reference Name</label>
                <input type="text" id="rname" class="border-2 border-gray-300 rounded-md p-2 w-full" placeholder="Reference Name" bind:value={reference_name}/>
            </div>
            <button on:click={editReferenceName} slot="confirm" class="w-24 px-2 py-1 text-white bg-emerald-500 hover:bg-emerald-400 rounded">SUBMIT</button>                        
            <button on:click={()=>isReference=-1} slot="close" class="w-24 px-2 py-1 text-white bg-red-500 hover:bg-red-400 rounded">Close</button>
        </Dialog>
    {/if}
</div>