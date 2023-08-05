<script>
    import { supabase } from '$lib/db'

    import { mesg } from '$lib/store.js'
    import {goto} from '$app/navigation'
    import config from '$lib/config.json'
    export let data    
    import _ from 'lodash'
    import { onMount } from 'svelte' 
    import Dialog from '$lib/dialog.svelte'
    import { acpc_recipt_print } from '$lib/reciept_print.js';
    let loading=false,formDt={}

    let error_mesg=data?.error,branchList
    let isConfirmInsertionDlg=false
    const getDateFormat=(dt)=>{
        const temp=''+(dt.getMonth()+1)
        const temp1=''+dt.getDate()
        return [dt.getFullYear(),temp.length<2?('0'+temp):temp,temp1.length<2?('0'+temp1):temp1].join('-')
    }
    const initFormDt=()=>{
        formDt.form_type=(data?.form_type.includes('acpc'))?'ACPC':(data?.form_type.includes('vacant'))?'VACANT':'MQNRI'
        formDt.academic_year=data?.formInfo?.AcademicYear?.id
        formDt.stu_name=data?.formInfo?.last_name+" "+data?.formInfo?.first_name+" "+data?.formInfo?.middle_name
        formDt.form_id=(data?.form_type.includes('acpc'))?(data?.formInfo?.id):null
        formDt.mqnri_form_id=(data?.form_type.includes('mqnri'))?(data?.formInfo?.id):null
        formDt.vacant_form_id=(data?.form_type.includes('vacant'))?(data?.formInfo?.id):null
        formDt.is_d2d=data?.formInfo?.is_d2d
        formDt.admission_category=data?.formInfo?.admission_category
        formDt.course=data?.formInfo?.course
        formDt.branch=data?.formInfo?.branch
        formDt.payment_status=1
        formDt.ACPC_amount=20000
        formDt.fees_collector_id=(data?.session?.user?.id)?(data?.session?.user?.id):-1
        formDt.payment_date=getDateFormat(new Date())
        formDt.dd_amount=0.0
        formDt.online_amount=0.0
        formDt.online_reference_number=''
    }
    onMount(()=>{
        if(data?.error){
            formDt.form_type=(data?.form_type.includes('acpc'))?'ACPC':(data?.form_type.includes('vacant'))?'VACANT':'MQNRI'
            return
        } 
        initFormDt()
        calculateAmountExpected()
    })
    $:fetchBranchList(formDt.course)
    $:if(formDt.fees_scheme)calculateAmountExpected()
    const calculateAmountExpected=()=>{
        formDt.amount_expected=0.0
        const tempDetail=data?.feeSchemeList?.find(ob=>{
            return ob.id==formDt.fees_scheme
        })
        tempDetail.AdmissionSubFeesInfo?.map(record1=>{            
            if(record1.course==formDt.course){
                let temp1=record1.amount
                if(record1.name=="Tution Fee" || record1.name=="Tution Fees"){
                        if(formDt.payment_status==0)
                            temp1=temp1/2.0
                }
                formDt.amount_expected+=temp1                    
            }
        })       
    }
    const fetchBranchList=(course1)=>{
        const temp1=data?.courseList?.find(ob=>ob.id==course1)
        branchList=temp1?temp1.Branch:[]
    }
    const handleSubmit=()=>{
        isConfirmInsertionDlg=true
        console.log(formDt)
    }
    const insertRecord=async()=>{
        try{
            loading = true
            if(data?.form_type.includes('acpc')){
                console.log('----',formDt.form_id)
            }
            else if(data?.form_type.includes('mqnri')) {
                console.log('****',formDt.mqnri_form_id)
            }
            console.log('----',formDt)
            const { data:dt, error:err1 } = await supabase
            .from('AdmissionFeesCollectionACPC')
            .upsert(formDt)
            .select('id')
            if(err1)
            {
                error_mesg=error.message     
                window.scrollTo(0,50)
                if(err1 instanceof Error){
                    error_mesg=err1.message
                }
                return
            }
            else{                
                $mesg='Form Record Inserted/Updated Successully.'    
                // 
                // printReciept()                
                goto(`/datatable/${(data?.form_type.includes('acpc'))?'acpc':(data?.form_type.includes('vacant'))?'vacant':'mqnri'}?ayear_id=${formDt.academic_year}&college_id=${data?.formInfo?.Course?.college_id}`)
            }            
        } catch (error) {
            error_mesg=error.message
            window.scrollTo(0,50)
            $mesg=''
            return
        } finally {
            isConfirmInsertionDlg=false
            loading = false
        }
    }

    const printReciept=()=>{    
        const feeSchemeList=data?.feeSchemeList?.find(ob=>ob.id==data?.feeFormInfo[data?.feeFormInfo.length-1]?.fees_scheme)
        const feeTempList=feeSchemeList.AdmissionSubFeesInfo.filter(tt=>tt.course==data?.feeFormInfo[data?.feeFormInfo.length-1]?.course)
        console.log('****----',data?.feeFormInfo[data?.feeFormInfo.length-1]);
        acpc_recipt_print(data?.feeFormInfo[data?.feeFormInfo.length-1],feeTempList)    
    }
    const rePayment=()=>{              
        console.log(data?.feeFormInfo[0])
        data.error=null        
        initFormDt()
    }
</script>

<div class="">
    {#if error_mesg}
        <div id="errormesg" class="w-full flex justify-between mt-2 mb-4 p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-orange-800 text-xl">{error_mesg}</div>
            <button on:click={()=>error_mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
    {/if}  
    {#if data?.error}
        <div class="flex justify-center px-2 py-2">
            <button on:click={printReciept} class="button-primary w-20">Receipt</button>
            <button on:click={rePayment} class="button-primary w-40">Re-Payment</button>
            <a class="button-primary w-20" href={`/datatable/${(data?.form_type.includes('acpc'))?'acpc':(data?.form_type.includes('vacant'))?'vacant':'mqnri'}?ayear_id=${data?.formInfo?.academic_year}&college_id=${data?.formInfo?.college_id}`}>PrevPage</a>
        </div>
    {/if}
    {#if !data?.error}
        <div class="mx-2 p-2 text-blue-800 bg-white border rounded">
            <div>
                <div class="flex justify-start items-center space-x-2 px-4">
                    <div class="text-lg font-bold">Academic Year:</div><div class="">{data?.formInfo?.AcademicYear?.name}</div>
                    <div class="text-lg font-bold">{data?.formInfo?.is_d2d?'(D2D)':''}</div>
                </div>
                <div class="flex justify-start items-center space-x-2 px-4">
                    <div class="text-lg font-bold">Name:</div><div class="">{formDt.stu_name}</div>
                </div>
            </div>            
        </div>
        {#if data?.prov2acpc?.length>0}
            <div class="mx-2 p-2 text-blue-800 bg-white border rounded"> 
                <p class="bg-teal-700 text-white text-lg text-center p-2 font-bold">Provisional Admission</p>
            </div>
        {/if}
        <form class="text-sm p-2" on:submit|preventDefault={handleSubmit}>        
        <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Admission Details</div>
        <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
            <div class="flex justify-between p-1 lg:flex-row flex-col">          
                <div class="flex flex-col w-full m-1 px-2">                    
                    <label for="course" class="font-bold">Select Category <span class="text-sm text-red-500">*</span></label>
                    <select bind:value={formDt.admission_category} class="input" type="text" name="admissioncategory" id="admissioncategory" disabled={data.formDt} required>
                        {#if config.admissionCategoryList}
                            {#each config.admissionCategoryList as record}
                                <option value={record.alias}>{record.category}({record.alias})</option>
                            {/each}
                        {/if}
                    </select>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label for="course" class="font-bold">Select Course <span class="text-sm text-red-500">*</span></label>
                    <select bind:value={formDt.course} class="input" type="text" name="course" id="course" required>
                        {#if data?.courseList}
                            {#each data?.courseList as course}
                                <option value={course.id}>{course.name}({course.alias})</option>
                            {/each}
                        {/if}
                    </select>
                </div>    
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">       
                <div class="flex flex-col w-full m-1 px-2">                    
                    <label for="course" class="font-bold">Select Branch <span class="text-sm text-red-500">*</span></label>
                    <select bind:value={formDt.branch} class="input" type="text" name="admissioncategory" id="admissioncategory" required>
                        {#if branchList}
                            {#each branchList as record}
                                <option value={record.id}>{record.name}({record.alias})</option>
                            {/each}
                        {/if}
                    </select>
                </div>
                <div class="flex flex-col w-full m-1 px-2">                    
                    <label for="course" class="font-bold">Fees Scheme <span class="text-sm text-red-500">*</span></label>
                    <select  bind:value={formDt.fees_scheme} class="input" type="text" name="admissioncategory" id="admissioncategory" required>
                        {#if data?.feeSchemeList}
                            {#each data?.feeSchemeList as record}
                                <option value={record.id}>{record.name}</option>
                            {/each}
                        {/if}
                    </select>
                </div>
            </div>    
        </div>
        <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Fees Details</div>
        <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
            <div class="flex justify-between p-1 lg:flex-row flex-col">          
                <div class="flex flex-col w-full m-1 px-2">                                       
                    <label for='mq' class="font-bold px-1">Fees Payment?H/F</label>
                    <div class="flex flex-row border border-blue-400 p-2 rounded">
                        <div class="flex items-center" on:change={calculateAmountExpected}><input bind:group={formDt.payment_status} value={0} type="radio" class="border w-4 p-2" id="half" name="halforfull"/><label class="mx-2 font-bold" for="half">Half</label></div>
                        <div class="flex items-center" on:change={calculateAmountExpected}><input bind:group={formDt.payment_status} value={1} type="radio" class="border w-4 ml-5 p-2" id="full" name="halforfull"/><label class="mx-2 font-bold" for="full">Full</label></div>
                    </div>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label for="expectedamount" class="font-bold">Amount Expected</label>    
                    <input bind:value={formDt.amount_expected}  class="border rounded px-1 py-2 border-blue-400" type="text" id="expectedamount" disabled>
                </div>    
            </div>                   
            <div class="px-4 border-y py-1 text-white font-bold bg-cyan-500  text-lg rounded">
                ACPC Payment Detail
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">          
                <div class="flex flex-col w-full m-1">
                    <label for="acpcamount" class="font-bold">ACPC Amount <span class="text-sm text-red-500">*</span></label>    
                    <input type="number" step="0.001" bind:value={formDt.ACPC_amount}  class="border rounded px-1 py-2 border-blue-400" id="acpcamount" required >
                </div>    
                <div class="flex flex-col w-full m-1">
                    <label for="acpcreceipt" class="font-bold">ACPC Receipt Number <span class="text-sm text-red-500">*</span></label>    
                
                <input bind:value={formDt.ACPC_reciept_number}  class="border rounded px-1 py-2 border-blue-400" type="text" id="acpcreceipt" required>
                </div>    
                <div class="flex flex-col w-full m-1">
                    <label for="acpcreciptdt" class="font-bold">ACPC Receipt Date <span class="text-sm text-red-500">*</span></label>    
                    <input type="date" bind:value={formDt.ACPC_payment_date}  class="border rounded px-1 py-2 border-blue-400" id="acpcreciptdt" required>
                </div>    
            </div>        
            <div class="px-4 border-y py-1 text-white font-bold bg-cyan-500  text-lg rounded">
                College Payment Detail
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">          
                <div class="flex flex-col w-full m-1">
                    <label for="cashamount" class="font-bold">Cash Amount <span class="text-sm text-red-500">*</span></label>    
                    <input on:focus={()=>{
                        formDt.cash_amount=(formDt.amount_expected-formDt.ACPC_amount>0)?(formDt.amount_expected-formDt.ACPC_amount):0}}
                                on:blur={()=>{formDt.dd_amount=formDt.amount_expected-formDt.ACPC_amount-formDt.cash_amount;formDt.dd_amount=formDt.dd_amount>0?formDt.dd_amount:0}} type="number" step="0.001" bind:value={formDt.cash_amount} class="border rounded px-1 py-2 border-blue-400" id="cashamount" required>
            </div>    
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col border-y-2 border-stone-200">          
                <div class="flex flex-col w-full m-1">
                    <label for="ddamount" class="font-bold">DD/Cheque Amount</label>    
                    <input type="number" step="0.001" bind:value={formDt.dd_amount}  
                    
                    on:blur={()=>{formDt.online_amount=formDt.amount_expected-formDt.ACPC_amount-formDt.cash_amount-formDt.dd_amount;formDt.online_amount=formDt.online_amount>0?formDt.online_amount:0}} class="border rounded px-1 py-2 border-blue-400" id="ddamount">
                </div>
                
                <div class="flex flex-col w-full m-1">
                    <label for="bname" class="font-bold">DD/Cheque Bank Name</label>    
                    <input type="text" bind:value={formDt.payment_bank_name} class="border rounded px-1 py-2 border-blue-400" id="bname">
                </div>    
                <div class="flex flex-col w-full m-1">
                    <label for="reference_number" class="font-bold">DD/Cheque Reference Number</label>    
                    <input type="text" bind:value={formDt.payment_reference_number} class="border rounded px-1 py-2 border-blue-400" id="reference_number">
                </div>                
                <div class="flex flex-col w-full m-1">
                    <label for="paymentdt" class="font-bold">DD/Cheque Payment Date</label>    
                    <input type="date" bind:value={formDt.payment_date}  class="border rounded px-1 py-2 border-blue-400" id="paymentdt">
                </div>                 
            </div>                        
            <div class="flex justify-between p-1 lg:flex-row flex-col border-b-2 border-stone-200">
                <div class="flex flex-col w-full m-1">
                    <label for="onlineamount" class="font-bold">Online Amount</label>    
                    <input type="number" step="0.001" bind:value={formDt.online_amount}  class="border rounded px-1 py-2 border-blue-400" id="onlineamount">
                </div>                       
                <div class="flex flex-col w-full m-1">
                    <label for="reference_number" class="font-bold">Online Reference Number</label>    
                    <input type="text" bind:value={formDt.online_reference_number} class="border rounded px-1 py-2 border-blue-400" id="reference_number">
                </div>       
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label for="comment" class="font-bold">Comment</label>    
                    <textarea bind:value={formDt.comment}  class="border rounded px-1 py-2 border-blue-400" id="comment"></textarea>
                </div>
            </div>
        </div>
        <div class="flex justify-end border flex-row border-blue-400 p-4 mt-4 bg-white shadow shadow-slate-400 rounded">
            <button disabled={loading} type="submit" class="w-48 button-primary">
                {#if loading}
                    Please Wait....
                {:else}
                    Submit
                {/if}
            </button>
        </div>        
        </form> 

    {/if}
</div>
<div>
    {#if isConfirmInsertionDlg}
        <Dialog>
            <div slot="header">Insert Record</div>
            <div slot="content">
                <p class="bg-slate-500 text-white text-center mb-2 text-lg p-2 font-bold">Total Amount For Payment: {(formDt.ACPC_amount?formDt.ACPC_amount:0.0)+(formDt.cash_amount?formDt?.cash_amount:0.0)+(formDt?.dd_amount?formDt?.dd_amount:0.0)+(formDt?.online_amount?formDt?.online_amount:0.0)}</p>   
                <p class="bg-slate-500 text-white text-center mb-2 text-lg p-2 font-bold">Expected Amount For Payment: {formDt.amount_expected}</p>
                Do You Really Want To Insert a Record?            
        </div>

            <button on:click={insertRecord} slot="confirm" class="w-24 px-2 py-1 text-white bg-emerald-500 hover:bg-emerald-400 rounded">Yes</button>                        
            <button on:click={()=>isConfirmInsertionDlg=false} slot="close" class="w-24 px-2 py-1 text-white bg-red-500 hover:bg-red-400 rounded">No</button>
        </Dialog>
    {/if}
</div>