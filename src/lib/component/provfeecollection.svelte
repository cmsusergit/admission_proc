<script>
    import {supabase} from '$lib/db.js'

    import Modal from '$lib/modal.svelte'
    import {academicYear,college,wordify} from '$lib/store.js'
    import { createEventDispatcher, onMount } from 'svelte'
    import pdfMake from "pdfmake/build/pdfmake"
    export let collectFeeRecord
    let amount,provAdmissionFeeRecord
    let txnnumber=''
    const dispatch= createEventDispatcher()

    
    onMount(async()=>{
        let { data: provAdmissionFee, error } = await supabase
        .from('ProvAdmissionFee')
        .select('*').eq('form_id',collectFeeRecord.id)
        if(provAdmissionFee){
            provAdmissionFeeRecord=provAdmissionFee
        }
        if(error){
            alert(error.message)
        }
    })
    const collectFee=async()=>{
        if(!amount)
        {
            alert("Amount Required")
            return
        }
        const { data, error } = await supabase
        .from('ProvAdmissionFee')
        .insert(
            { collected_on: new Date(),amount: amount,txn_number:txnnumber,
                form_id:collectFeeRecord.id,academic_year:$academicYear.id,college_id:$college.id }
        ).select().single()
        if(error){
            alert(error.message)
            return
        }
        if(data){
            alert("Record Inserted")     
            let { data: form_number, error:err1 } = await supabase
            .from('ProvFormInfo')
            .select('*').eq('id',collectFeeRecord.id).single()
            if(err1){
                console.log('****',err1)
                return
            }
            generateReceipt(data,form_number?.form_number)
            dispatch("close")
        }
    }
    const generateReceipt=(record,form_number)=>{
        console.log(collectFeeRecord);
        const subtitle1="Rajupura village,Vasad,anand,Gujarat-388306,India.ph. 9510782983. Web:www.svitvasad.ac.in, Email:admission@svitvasad.ac.in"
        const dataUri=$college.logo
        const currDt=new Date(record.collected_on)
        const currDtStr=String(currDt.getDate()).padStart(2,'0')+'-'+String(currDt.getMonth()+1).padStart(2,'0')+'-'+currDt.getFullYear()
        const paidamt=record.amount
        const contentText=`Received from "${collectFeeRecord.title?collectFeeRecord.title:''} ${collectFeeRecord.first_name?collectFeeRecord.first_name:''} ${collectFeeRecord.middle_name?collectFeeRecord.middle_name:''} ${collectFeeRecord.last_name?collectFeeRecord.last_name:''}" the sum of rupees ${paidamt} in words ${wordify(Number.parseFloat(paidamt))} Only on the account of applied for ${collectFeeRecord.Course.name} (${collectFeeRecord.Branch.name} ${collectFeeRecord.is_d2d?'-D2D':''})`
        const titleText=`${$college.name}`
        let titleContent={columns:[]}
        if(dataUri)
            titleContent.columns.push({image:dataUri,width:50,fit:[50,50]})
        titleContent.columns.push({
            stack:[
                {margin: [0, 10, 0, 0],style:'header',alignment:'center',width:'*',fontSize:11,bold:true,text:titleText.toUpperCase()},
                {margin:[20,0,0,0],style:'subheader',alignment:'center',fontSize:10,text:subtitle1}
            ]
        }
        )
        const tbl1={
                layout:'noBorders',
                margin:[5,5,5,5],
                border: [false, false, false, false],
                table:{
                    body:[
                        [{fontSize:10,alignment:'right',text:'(Student Copy)'}],
                        [titleContent],      
                        [{margin:[2,2,2,2],fontSize:10,alignment:'right',text:'TXN-Number: '+(record?.txn_number??'-')}],                  
                        [{margin:[5,2,5,2],style:'subheader',fontSize:12,alignment:'center',text:"RECEIPT",decoration:'underline',bold:true}],
                        [{columns:[{margin:[20,2,20,2],bold:true,fontSize:10,alignment:'left',text:`Recipt Number:${$college.alias}-${form_number??'________'}`},{margin:[20,2,20,2],bold:true,fontSize:10,alignment:'right',text:"Date: "+currDtStr}]}],
                        [{margin:[5,2,5,2],height:122,fontSize:10,alignment:'justify',text:contentText}],
                        [{margin:[20,25,20,2],fontSize:10,bold:true,alignment:'right',text:`Receiver Signature\n${$college.alias},Vasad`}]
                    ]
        }}
        const tbl2=JSON.parse(JSON.stringify(tbl1))
        tbl2.table.body[0][0].text="(Institute Copy)"
        const tbl1_1=JSON.parse(JSON.stringify(tbl1))
        tbl1_1.table.body[0][0].text="(Account Office Copy)"
        //  
        // const tbl2_1=JSON.parse(JSON.stringify(tbl2))
        let reportDefination=[{
            table:{
                heights:[220,1,220,1,220],
                widths:['*'],
                body:[
                    [tbl1],
                    [{border:[false,false,false,true],text:"    "}],
                    [tbl2],
                    [{border:[false,false,false,true],text:"    "}],
                    [tbl1_1],
                    // [{border:[false,false,false,true],text:"    "}],
                    // [tbl2_1],
                ]}}]                
            // 
            // pdfMake.vfs = pdfFonts.pdfMake.vfs            
            pdfMake.fonts = {
                    Courier: {
                        normal: 'Courier',
                        bold: 'Courier-Bold',
                        italics: 'Courier-Oblique',
                        bolditalics: 'Courier-BoldOblique'
                    },
                    Roboto: {
                        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
                        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
                        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
                
                        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
                    },
            }
            pdfMake.createPdf({pageOrientation:'portrait',
            content:reportDefination,
            defaultStyle:{fontSize:11}
            }).open()    
    }
</script>

<Modal on:close={()=>{dispatch('close')}}>
    <div slot="header">Fee Collection</div>
    <div slot="content">
        <div class="flex flex-col">
            <div class="font-bold p-1 text-center my-1 border-b">
                {collectFeeRecord.title?collectFeeRecord.title:''} {collectFeeRecord.first_name?collectFeeRecord.first_name:''} {collectFeeRecord.middle_name?collectFeeRecord.middle_name:''} {collectFeeRecord.last_name?collectFeeRecord.last_name:''}
            </div>
            {#if $college?.qrcode_image}
                <div class="flex flex-col justify-center text-center px-2 py-4">
                    <img class="mx-auto w-1/2" src={$college?.qrcode_image} alt="QR" width="250" height="250">
                    <p class="bg-orange-800 text-white text-xl font-bold">Please, Don't use credit card for Payment</p>
                </div>                            
            {/if}
            <div>
                {#if provAdmissionFeeRecord && provAdmissionFeeRecord.length>0}
                    <table class="my-4 border w-full text-center">
                        <thead>
                            <tr>              
                                <th class="py-1 border">Sr.</th>          
                                <th class="py-1 border">Collected On</th>
                                <th class="py-1 border">Amount</th><th></th>
                            </tr>                    
                        </thead>
                        <tbody>                
                            {#each provAdmissionFeeRecord  as record,indx}
                                <tr>
                                    <td class="py-1 border">{indx+1}</td>
                                    <td class="py-1 border">{new Date(record?.collected_on).toDateString()}</td>
                                    <td class="py-1 border">{record?.amount}</td>
                                    <td class="py-1 border">
                                        <button on:click={()=>generateReceipt(record,collectFeeRecord.form_number)} class="bg-blue-500 hover:bg-blue-400 px-2 py-1 text-white border rounded-md">
                                            <svg fill="none" width="28" height="28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M5 2H3v20h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2V2h-2v2h-2V2h-2v2h-2V2h-2v2H9V2H7v2H5V2zm2 2h2v2h2V4h2v2h2V4h2v2h2v12h-2v2h-2v-2h-2v2h-2v-2H9v2H7v-2H5V6h2V4zm0 4h10v2H7V8zm10 4H7v2h10v-2z" fill="currentColor"/> </svg>
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/if}
            </div>
            <div class="flex flex-col">
                <label class="font-bold text-sm" for="feetext">Fee Amount</label>
                <input type="number" step="0.1" class="input" min="0" bind:value={amount} name="feetext">
                <label class="font-bold text-sm" for="txntext">Txn. Number</label>
                <input type="text" class="input" bind:value={txnnumber} name="txntext">
            </div>
        </div>                
    </div>
    <div slot="foot">
        <div class="">
            <button on:click={collectFee} class="px-2 py-2 bg-blue-500 text-white hover:bg-blue-400 shadow shadow-blue-400 rounded disabled:bg-gray-400 uppercase w-48" type="button">submit</button>
            <button on:click={()=>{dispatch('close')}} class="px-2 py-2 bg-orange-700 text-white hover:bg-orange-500 shadow shadow-orange-400 uppercase rounded disabled:bg-gray-400 w-48">Close</button>
        </div>
    </div>
</Modal> 
