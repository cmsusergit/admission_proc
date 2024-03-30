import pdfMake from "pdfmake/build/pdfmake"
import 'pdfmake/build/vfs_fonts'

import _ from 'lodash'
import {wordify} from'$lib/store.js'

const acpc_recipt_print=async (formDt,feeSchemeList)=>{    
    console.log('****',feeSchemeList)
    const college=formDt?.Course?.College
    const currAYear=formDt?.AcademicYear.name
    const dataUri=college.logo
    const titleText=`${college.name.toUpperCase()}

    Academic Year: ${currAYear}`    
    const headerTbl1={
        layout:"noBorders",
        table:{         
        headerRows:0,
        widths:[20,'*'],
        body:[
            [{image:dataUri,fit:[40,40]},
            {margin: [0, 10, 0, 0],style:'header',alignment:'center',fontSize:10,bold:true,text:titleText}]
        ]
    }}
    let reportHeading={
        margin:[10,10,10,2],
        style:'subheader',
        columns:[{alignment:'left',text:"Student ID: "+ formDt.stu_college_id},{alignment:'right',text:"Receipt Number: "+formDt.reciept_number}]
    }
    let reportHeading1={
        margin:[10,2,10,2],
        layout:"noBorders",
        table:{         
        headerRows:0,
            widths:['*',100],
            body:[
                [   
                    {alignment:'left',text:"Branch Name: "+ formDt?.Branch?.name},
                    {alignment:'right',text:"Date: "+new Date(formDt?.payment_date).toLocaleString('en-IN',{day:"numeric",month:"numeric",year:"numeric"})}
                ]
            ]
        }
    }
    let reportTable=[]
    reportTable.push([
        {fillColor:'#dde',alignment:'center',text:'Sr.'},
        {fillColor:'#dde',alignment:'center',text:'Particulars'},
        {fillColor:'#dde',alignment:'center',text:'Fees in Rs.'}
    ])
    const categoryList=_.groupBy(feeSchemeList,ob=>ob.AdmissionFeesCategory.id)
    _.forEach(categoryList,(categoryRecord,category)=>{
        reportTable.push(['',{fontSize:10,bold:true,fontSize:10,text:categoryRecord[0].AdmissionFeesCategory.name},''])
        let count1=1,total=0.0        
        categoryRecord=_.orderBy(categoryRecord,['amount'],['desc'])
        categoryRecord.map(record1=>{
                let temp1=record1.amount
                console.log(record1.name);
                if(record1.name=="Tution Fee" || record1.name=="Tution Fees"){
                    if(formDt?.payment_status==false)
                        temp1=temp1/2.0
                }
            reportTable.push([{alignment:'center',fontSize:10,text:count1},
                {alignment:'left',fontSize:10,text:record1.name},
                {alignment:'right',fontSize:10,text:temp1.toLocaleString('en-IN',{
                    maximumFractionDigits:2                              
                })}])
                count1=count1+1
                total=total+temp1
        })
        reportTable.push([{fillColor:'#dee',text:''},{fillColor:'#dee',fontSize:8,bold:true,text:'SubTotal',alignment:'right'},{fontSize:8,alignment:'right',fillColor:'#dee',bold:true,text:total.toLocaleString('en-IN',{
                        maximumFractionDigits:2
                    })}])
    })
    reportTable.push(['',{fontSize:8,alignment:'right',bold:true,text:"Grand Total in Rs."},{fontSize:8,bold:true,alignment:'right',text:formDt.amount_expected.toLocaleString('en-IN',{
                        maximumFractionDigits:2
                    })}])
    let detailTable=[
        [

            {bold:true, fontSize:10,text:`CASH`},
            {bold:true,colSpan:4, fontSize:10,text:`Amount:  ${Number.parseFloat(formDt.cash_amount).toLocaleString('en-IN',{maximumFractionDigits:2})}`},            
            {text:''},{text:``},{text:''}
        ],
        [               
            {bold:true,fontSize:10,text:'DD/Cheque'},
            {border:[true,true,true,false],fontSize:10,text:`Amount:  ${Number.parseFloat(formDt.dd_amount).toLocaleString('en-IN',{maximumFractionDigits:2})}`},
            {fontSize:10,text:`Bank Name:  ${formDt.payment_bank_name?formDt.payment_bank_name:'-'}`,border:[true,true,true,false]},      
            {fontSize:10,text:`Ref. Number:  ${formDt.payment_reference_number??'-'}`,border:[true, false, true, true]}, 
            {border:[true,true,true,false],fontSize:10,text:`Date:  ${new Date(formDt.payment_date).toLocaleString('en-IN',{day:"numeric",month:"numeric",year:"numeric"})}`},
        ],
        [   
            {bold:true,fontSize:10,text:'Online'},
            {border:[true,true,true,false],colSpan:2,fontSize:10,text:`Amount:  ${Number.parseFloat(formDt.online_amount).toLocaleString('en-IN',{maximumFractionDigits:2})}`},
            
            {text:''},
            {fontSize:10,colSpan:2,text:`Reference Number:  ${formDt.online_reference_number??'-'}`,border:[true, true, true, true]},{text:''}
        ],
        [   {fontSize:10,bold:true,text:'ACPC'},
            {fontSize:10,text:`Amount:  ${Number.parseFloat(formDt.ACPC_amount??0.0).toLocaleString('en-IN',{maximumFractionDigits:2})}`},
            {fontSize:10,text:`Rec.Number:  ${formDt.ACPC_receipt_number??'-'}`},

            {fontSize:10,colSpan:2,text:`Payment Date:  ${formDt.ACPC_amount>0?new Date(formDt.ACPC_payment_date).toLocaleString('en-IN',{day:"numeric",month:"numeric",year:"numeric"}):'-'}`},
            {text:''}
        ]  
    ]               

    const footText="Note:: In addition to above tuition fees, candiadate shall have to pay the fees of course/institute fixed by the Fees Regulatory Committee as and when declared from the acadamic year "+currAYear
    +"\n Note:: Rs.5,000/- refundable deposit after Final Semester clear and verification of original Marksheet"
    let reportDefination=[
        headerTbl1,
        reportHeading,
        reportHeading1,


        {margin:[10,2,10,2],style:"subheader",text:"Recieved From,"},
        {margin:[10,2,10,2],fontSize:10,style:"subheader",text:`${formDt?.stu_name}`},
        {
            margin:[10,2,10,5],style:"subheader",
            text:[
                `The Following amount as Fees for the ${formDt.Course.alias} ${formDt.is_d2d?'(D2D)':''} for a `,
                    {bold:true,fontSize:10,decoration:'underline',text:`${formDt.is_d2d?(formDt.payment_status==false?'THIRD':'SECOND'):'FIRST'} ${formDt?.payment_status==false?'SEMESTER':'YEAR'}`},` ${currAYear}`
            ]
        },   
        
        {
            table:{
                headerRows:1,
                widths:[40,'*',80,],
                body:reportTable
                }
        },
        {margin:[10,10,10,10],bold:true,text:'In Words:'+ wordify(Number.parseFloat(formDt.amount_expected)) +" Only"},
        {
            table:{
                headerRows:0,
                widths:['*','*','*','*','*'],
                body:detailTable
            }
        },  
        {
            margin:[10,10,2,2],alignment:'right',canvas:[
                {
                    type:'rect',
                    x:0,y:0,w:40,h:44
                }]
        },
        {margin:[10,1,2,2],fontSize:'10',bold:true,alignment:'right',text:"Authorized Signature\nSVIT,Vasad"},
        {margin:[2,2,2,2],fontSize:'8',bold:true,alignment:'left',text:footText} 
    ]   
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
    pdfMake.createPdf({content:reportDefination,pageOrientation: 'portrait',pageSize: 'A4'}).open()
}




const mqnri_recipt_print=async()=>{}    
export {acpc_recipt_print,mqnri_recipt_print}










