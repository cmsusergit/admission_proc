import pdfMake from "pdfmake/build/pdfmake"
import 'pdfmake/build/vfs_fonts'

import _ from 'lodash'
import {wordify} from'$lib/store.js'

const acpc_recipt_print=async (formDt,feeSchemeList)=>{    
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
            {margin: [0, 10, 0, 0],style:'header',alignment:'center',fontSize:12,bold:true,text:titleText}]
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
    const categoryList=_.groupBy(feeSchemeList?.AdmissionSubFeesInfo,ob=>ob.AdmissionFeesCategory.name)
    _.forEach(categoryList,(categoryRecord,category)=>{
        reportTable.push(['',{fontSize:12,bold:true,fontSize:11,text:category},''])
        let count1=1,total=0.0        
        categoryRecord=_.orderBy(categoryRecord,['amount'],['desc'])
        categoryRecord.map(record1=>{
                let temp1=record1.amount
                if(record1.name=="Tuition Fee"){
                    if(formDt?.payment_status==false)
                        temp1=temp1/2.0
                }
            reportTable.push([{alignment:'center',fontSize:11,text:count1},
                {alignment:'left',fontSize:11,text:record1.name},
                {alignment:'right',fontSize:11,text:temp1.toLocaleString('en-IN',{
                    maximumFractionDigits:2                              
                })}])
                count1=count1+1
                total=total+temp1
        })
        reportTable.push([{fillColor:'#dee',text:''},{fillColor:'#dee',fontSize:12,bold:true,text:'SubTotal',alignment:'right'},{fontSize:12,alignment:'right',fillColor:'#dee',bold:true,text:total.toLocaleString('en-IN',{
                        maximumFractionDigits:2
                    })}])
    })
    reportTable.push(['',{fontSize:12,alignment:'right',bold:true,text:"Grand Total in Rs."},{fontSize:12,bold:true,alignment:'right',text:formDt.amount_expected.toLocaleString('en-IN',{
                        maximumFractionDigits:2
                    })}])
    let detailTable=[
        [
            {bold:true,fontSize:11,text:` Amount:  ${Number.parseFloat(formDt.cash_amount).toLocaleString('en-IN',{maximumFractionDigits:2})}`},            
            {text:`Type Of Payment:  CASH`,fontSize:11},{text:''}
        ],
        [
            {border:[true,true,true,false],fontSize:11,text:`Amount:  ${Number.parseFloat(formDt.amount_paid).toLocaleString('en-IN',{maximumFractionDigits:2})}`},
            {fontSize:11,text:`Type Of Payment:  ${formDt.payment_type?formDt?.payment_type:'-'}`,border:[true,true,true,false]},
            {border:[true,true,true,false],fontSize:11,text:`Date:  ${new Date(formDt.payment_date).toLocaleString('en-IN',{day:"numeric",month:"numeric",year:"numeric"})}`},
        ],
        [
                {border:[true,false,true,true],fontSize:11,text:''},
                {fontSize:11,text:`Bank Name:  ${formDt.payment_bank_name??'-'}`,border:[true, false, false, false]},
                {fontSize:11,text:`Ref. Number:  ${formDt.payment_refrence_number??'-'}`,border:[true, false, true, true]}
        ],
        [
            {fontSize:11,text:`ACPC Amount:  ${Number.parseFloat(formDt.ACPC_amount??0.0).toLocaleString('en-IN',{maximumFractionDigits:2})}`},
            {fontSize:11,text:`ACPC Rec.Number:  ${formDt.ACPC_receipt_number??'-'}`},
            {fontSize:11,text:`ACPC PaymentDate:  ${formDt.ACPC_amount>0?new Date(formDt.ACPC_payment_date).toLocaleString('en-IN',{day:"numeric",month:"numeric",year:"numeric"}):'-'}`},
        ]  
    ]               
    const footText="Note:: In addition to above tuition fees, candiadate shall have to pay the fees of course/institute fixed by the Fees Regulatory Committee as and when declared from the acadamic year "+currAYear
    +"\n Note:: Rs.5,000/- refundable deposit after Final Semester clear and verification of original Marksheet"
    let reportDefination=[
        headerTbl1,
        reportHeading,
        reportHeading1,
        {margin:[10,2,10,2],style:"subheader",text:"Recieved From,"},
        {margin:[10,2,10,2],fontSize:11,style:"subheader",text:`${formDt?.stu_name}`},
        {
            margin:[10,2,10,5],style:"subheader",
            text:[
                `The Following amount as Fees for the ${formDt.Course.alias} ${formDt.is_d2d?'(D2D)':''} for a `,
                
                    {bold:true,fontSize:11,decoration:'underline',text:`${formDt.is_d2d?(formDt.payment_status==false?'THIRD':'SECOND'):'FIRST'} ${formDt?.payment_status==false?'SEMESTER':'YEAR'}`},` ${currAYear}`
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
                widths:['*','*','*'],
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
