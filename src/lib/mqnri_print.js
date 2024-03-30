import pdfMake from "pdfmake/build/pdfmake"
import config from '$lib/config.json'

import 'pdfmake/build/vfs_fonts'
import {supabase} from "$lib/db"
const separator=(text)=>{
    return {
        table: {
            headerRows:0,
            widths:['*'],
            body: [
                [
                    {

                        border: [false, true, false, true],
                        fillColor: '#abd1ff',
                        text:text,
                        style:{alignment:'center',fontSize:14,bold:true,decoration:'underline'}
                    }
                ]
            ]
        }}
}
const mqnri_profile_print=async(college,currAYear,profile)=>{
    console.log(profile)
    const dataUri=college.logo
    const titleText=`${college.name}
                        Managed By: The New English School Trust
                        ${profile.admission_category=='V'?'Vacant':'MQ/NRI/NRI Sponsored'} Application Form (${currAYear})`
    
        const headerTbl1={         
        headerRows:0,
        widths:[50,'*'],
        body:[
            [   
                {alignment:'left',image:dataUri,fit:[50,50]},
                {alignment:'center',fontSize:12,bold:true,text:titleText},
            ]
        ]
    }  
    let admissionRecord={        
        table: {
            headerRows:0,
            widths:['*','*','*','*','*','*'],
            body: [
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
                [   
                    {text:'ACPC Number: ',style:{alignment:'center'}},{text:profile.acpcnumber,style:{alignment:'center'}},
                    {text:'ACPC Merit Number: ',style:{alignment:'center'}},{text:profile.acpc_meritnumber,style:{alignment:'center'}},
                    {text:'Entrance Exam Number: ',style:{alignment:'center'}},{text:profile.entr_examnumber,style:{alignment:'center'}},
                ],
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
            ]
        }
    }  

    const stuName=`${profile.title} ${profile.first_name} ${profile.middle_name} ${profile.last_name}`    
    let personalRecord={        
        table: {
            headerRows:0,
            widths:['*','*','*','*'],
            body: [
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
                [   
                    {text:'Name ',style:{bold:true}},{text:stuName,colSpan:3}
                ],
                [
                    {text:'Current Address ',style:{bold:true}},{text:profile.present_addr1+'\n'+profile.present_addr2,colSpan:3}
                ],
                [
                    {text:'State ',style:{bold:true}},{text:profile.present_state},                    
                    {text:'Country',style:{bold:true}},{text:profile.present_country}
                ],
                [
                    {text:'City ',style:{bold:true}},{text:profile.present_city},
                    {text:'Pincode ',style:{bold:true}},{text:profile.present_zipcode}
                ],                
                [
                    {text:'Contact ',style:{bold:true}},{text:profile.contact,colSpan:3},
                ],
                [{text:'Email ',style:{bold:true}},{text:profile.email,colSpan:3}],
                [

                    {text:'Birth Date ',style:{bold:true}},{text:new Date(profile.dob).toLocaleDateString('en-IN')},
                    {text:'Gender ',style:{bold:true}},{text:profile.gender}
                ],
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
            ]
        }
    }
    let academicRecord={        
        table: {
            headerRows:0,
            widths:['*','*'],
            body: [                
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
                [
                    {text:'Exam Board ',style:{bold:true}},
                    {text:profile.board_name}
                ],
                [
                    {text:'Last School Name ',style:{bold:true}},{text:profile.last_schoolname}],
                [{text:'Last School City ',style:{bold:true}},{text:profile.last_schoolcity}
                ],
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
            ]
        }
    }
    let boardResultList=[                
        [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
        [{text:'Subject',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}},{text:'Theory (Obtained)',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}},{text:'Theory (Out of)',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}},{text:'Practical (Obtained)',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}},{text:'Practical (Out of)',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}}],
    ]
    let thTotal=0,prTotal=0
    let thTotal1=0,prTotal1=0
    profile.subjectResultList.forEach(ob=>{
        let record=[{text:ob.subName[ob.selectedIndx],style:{alignment:'center',bold:true}}]
        thTotal+=ob.theoryObtained
        record.push({text:ob.theoryObtained,style:{alignment:'center',bold:true}})
        thTotal1+=ob.theoryOutof
        record.push({text:ob.theoryOutof,style:{alignment:'center',bold:true}})
        prTotal+=ob.practicalObtained
        record.push({text:ob.practicalObtained,style:{alignment:'center',bold:true}})
        prTotal1+=ob.practicalOutof
        record.push({text:ob.practicalOutof,style:{alignment:'center',bold:true}})
        boardResultList.push(record)
    })
    boardResultList.push([{text:'Total',style:{alignment:'center',bold:true}},{text:thTotal,style:{alignment:'center',bold:true}},{text:thTotal1,style:{alignment:'center',bold:true}},{text:prTotal,style:{alignment:'center',bold:true}},{text:prTotal1,style:{alignment:'center',bold:true}}])
    boardResultList.push([{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}])
    let boardDetail={        
        table: {
            headerRows:0,    
            widths:['*','*','*','*','*'],
            body: boardResultList
        }
    }
    let entrnceDetailList=[                
        [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
        [{text:'Subject',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}},{text:'GUJCET',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}}]
    ]
    let gjTotal=0


    profile.entrnceExamDetail.forEach(ob=>{
        let record=[{text:ob.subName,style:{alignment:'center',bold:true}}]
        gjTotal+=ob.gujcetReult
        record.push({text:ob.gujcetReult,style:{alignment:'center'}})
        entrnceDetailList.push(record)
    })   
    entrnceDetailList.push([{text:'Total',style:{alignment:'center',bold:true}},{text:gjTotal,style:{alignment:'center',bold:true}}])
    let entrnceDetail={        
        table: {
            headerRows:0,    
            widths:['*','*'],
            body: entrnceDetailList
        }
    }
    const footText=`I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief.`
    let form_number=profile.form_number['M']?`MQ Form Number - ${profile.form_number['M']}`:''
    form_number+=form_number?'|':''
    form_number+=profile.form_number['N']?`NRI Form Number - ${profile.form_number['N']}`:''
    let reportDefination=[
        {
            table:headerTbl1,
        },
        {
            margin:[0,5,0,0],
            columns: [
                {margin:[10,0,10,0],text:`${form_number}`,style:{bold:true,alignment:'left',fontSize:11}}, 
                {margin:[10,0,10,0],text:`Applied For: ${profile.admission_category}`,style:{bold:true,alignment:'right',fontSize:11}},
            ]
        },
        admissionRecord,
        separator('PERSONAL DETAILS'),     
        personalRecord,
        separator('ACADEMIC DETAILS'),     
        academicRecord, 
        separator('BOARD EXAM RESULT'),
        boardDetail,
        separator('ENTRANCE EXAM RESULT'),
        entrnceDetail,
        {margin:[0,5,0,14],text:footText,style:{fontSize:11,alignment:'justify',bold:false}},
		{margin:[0,0,0,0],text:"____________________",style:{alignment:'right',bold:true}},
		{margin:[0,0,0,0],text:"Signature",style:{alignment:'right',bold:true}}
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
        pdfMake.createPdf({pageOrientation:'portrait',
        content:reportDefination,
        defaultStyle:{fontSize:11}
        }).open()
}

const acpc_profile_print=async(college,currAYear,profile)=>{
    if(!profile.Branch){

        let { data: Branch, error } = await supabase
            .from('Branch')
            .select('name')
            .eq('id',profile.branch).single()
        console.log('****',Branch)

        profile.Branch={...Branch}//....
        //....
    }

    console.log('----',profile)
    const dataUri=college.logo
    const titleText=`${college.name}
                        Managed By: The New English School Trust \n Application Form (${currAYear})`
        const headerTbl1={         
        headerRows:0,
        widths:[50,'*'],

        body:[
            [ 
                {alignment:'left',image:dataUri,fit:[50,50]},
                {alignment:'center',fontSize:12,bold:true,text:titleText},
            ]
        ]
    }  
    let admissionRecord={   
        width: '*',     
        table: {
            headerRows:0,
            heights:20,
            widths:['*','*'],
            body: [
                [   
                    {text:'ACPC Number: ',style:{alignment:'center'}},{text:profile.acpcnumber,style:{alignment:'center'}}
                ],[
                    {text:'ACPC Merit Number: ',style:{alignment:'center'}},{text:profile.acpc_meritnumber,style:{alignment:'center'}}
                ],[                    
                    {text:'Entrance Exam Number: ',style:{alignment:'center'}},{text:profile.entr_examnumber,style:{alignment:'center'}},
                ],
                [
                    {text:'Branch: ',style:{alignment:'center'}},{text:(profile?.Branch?.name)??'-',style:{alignment:'center'}}
                ]
            ]
        }
    }  
    const stuName=`${profile.last_name} ${profile.first_name} ${profile.middle_name}`    
    let personalRecord={        
        table: {
            headerRows:0,
            widths:['*','*','*','*'],
            body: [
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
                [   
                    {text:'Name ',style:{bold:true}},{text:stuName,colSpan:3}
                ],
                [
                    {text:'Current Address ',style:{bold:true}},{text:profile.present_addr1+'\n'+profile.present_addr2??'',colSpan:3}
                ],
                [
                    {text:'State ',style:{bold:true}},{text:profile.present_state},                    
                    {text:'Country',style:{bold:true}},{text:profile.present_country}
                ],
                [
                    {text:'City ',style:{bold:true}},{text:profile.present_city},
                    {text:'Pincode ',style:{bold:true}},{text:profile.present_zipcode}
                ],                
                [
                    {text:'Contact ',style:{bold:true}},{text:profile.contact,colSpan:3},
                ],
                [{text:'Email ',style:{bold:true}},{text:profile.email,colSpan:3}],
                [

                    {text:'Birth Date ',style:{bold:true}},{text:new Date(profile.dob).toLocaleDateString('en-IN')},
                    {text:'Gender ',style:{bold:true}},{text:profile.gender}
                ],
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
            ]
        }
    }
    let academicRecord={        
        table: {
            headerRows:0,
            widths:['*','*'],
            body: [                
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
                [
                    {text:'Exam Board ',style:{bold:true}},
                    {text:profile.board_name}
                ],
                [
                    {text:'Last School Name ',style:{bold:true}},{text:profile.last_schoolname}],
                [{text:'Last School City ',style:{bold:true}},{text:profile.last_schoolcity}
                ],
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
            ]
        }
    }
    
    let boardResultList=[                
        [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
        [{text:'Subject',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}},{text:'Result',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}}],
    ]
    if(profile.subjectResultList)
        profile.subjectResultList.forEach(ob=>{
            console.log('****',ob)
            let record=[{text:ob.subName,style:{alignment:'center',bold:true}}]
            record.push({text:ob.result,style:{alignment:'center',bold:true}})
            boardResultList.push(record)
        })
    let boardDetail={        
        table: {
            headerRows:0,    
            widths:['*','*'],
            body: profile.subjectResultList?boardResultList:[[],[]]
        }
    }
    const footText=`I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief.`

    let form_number=profile?.id
    let reportDefination=[        
        {
            table:headerTbl1,
        },
        {
            margin:[0,5,0,0],            
            columns: [
                {margin:[10,0,10,0],text:`${form_number}`,style:{bold:true,alignment:'left',fontSize:11}}, 
                {margin:[10,0,10,0],text:`Applied For: ${config.admissionCategoryList.find(ob=>ob.alias==profile?.admission_category)?.category}`,style:{bold:true,alignment:'right',fontSize:11}},
            ]
        },
        {
            margin:[0,5,0,0],            
            columns: [
                admissionRecord,
                {
                    width: '121',
                    margin:[5,0,2,10],alignment:'right',canvas:[
                        {
                            type:'rect',
                            x:0,y:0,w:100,h:104
                        }]
                },
            ]
        },       

        separator('PERSONAL DETAILS'),     
        personalRecord,
        separator('ACADEMIC DETAILS'),     
        academicRecord, 
        separator('BOARD EXAM RESULT'),
        boardDetail,
        {margin:[0,5,0,14],text:footText,style:{fontSize:11,alignment:'justify',bold:false}},
		{margin:[0,0,0,0],text:"____________________",style:{alignment:'right',bold:true}},
		{margin:[0,0,0,0],text:"Signature",style:{alignment:'right',bold:true}}
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
        pdfMake.createPdf({pageOrientation:'portrait',
        content:reportDefination,
        defaultStyle:{fontSize:11}
        }).open()
}
const mqnri_profile_print1=async(college,currAYear,profile)=>{
    console.log(profile)
    const dataUri=college.logo
    const titleText=`${college.name}
                        Managed By: The New English School Trust \n Application Form (${currAYear})`
        const headerTbl1={         
        headerRows:0,
        widths:[50,'*'],
        body:[
            [ 
                {alignment:'left',image:dataUri,fit:[50,50]},
                {alignment:'center',fontSize:12,bold:true,text:titleText},
            ]
        ]
    }  
    let admissionRecord={   
        width: '*',     
        table: {
            headerRows:0,
            heights:20,
            widths:['*','*'],
            body: [
                [   
                    {text:'ACPC Number: ',style:{alignment:'center'}},{text:profile.acpcnumber,style:{alignment:'center'}}
                ],[
                    {text:'ACPC Merit Number: ',style:{alignment:'center'}},{text:profile.acpc_meritnumber,style:{alignment:'center'}}
                ],[                    
                    {text:'Entrance Exam Number: ',style:{alignment:'center'}},{text:profile.entr_examnumber,style:{alignment:'center'}},
                ],
                [
                    {text:'Branch: ',style:{alignment:'center'}},{text:(profile?.Branch?.name)??'-',style:{alignment:'center'}}
                ]
            ]
        }
    }  
    const stuName=`${profile.last_name} ${profile.first_name} ${profile.middle_name}`    
    let personalRecord={        
        table: {
            headerRows:0,
            widths:['*','*','*','*'],
            body: [
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
                [   
                    {text:'Name ',style:{bold:true}},{text:stuName,colSpan:3}
                ],
                [
                    {text:'Current Address ',style:{bold:true}},{text:profile.present_addr1+'\n'+profile.present_addr2,colSpan:3}
                ],
                [
                    {text:'State ',style:{bold:true}},{text:profile.present_state},                    
                    {text:'Country',style:{bold:true}},{text:profile.present_country}
                ],
                [
                    {text:'City ',style:{bold:true}},{text:profile.present_city},
                    {text:'Pincode ',style:{bold:true}},{text:profile.present_zipcode}
                ],                
                [
                    {text:'Contact ',style:{bold:true}},{text:profile.contact,colSpan:3},
                ],
                [{text:'Email ',style:{bold:true}},{text:profile.email,colSpan:3}],
                [

                    {text:'Birth Date ',style:{bold:true}},{text:new Date(profile.dob).toLocaleDateString('en-IN')},
                    {text:'Gender ',style:{bold:true}},{text:profile.gender}
                ],
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
            ]
        }
    }
    let academicRecord={        
        table: {
            headerRows:0,
            widths:['*','*'],
            body: [                
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
                [
                    {text:'Exam Board ',style:{bold:true}},
                    {text:profile.board_name}
                ],
                [
                    {text:'Last School Name ',style:{bold:true}},{text:profile.last_schoolname}],
                [{text:'Last School City ',style:{bold:true}},{text:profile.last_schoolcity}
                ],
                [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
            ]
        }
    }
    
    let boardResultList=[                
        [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]}],
        [{text:'Subject',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}},
        {text:'Theory',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}},
        {text:'Practical',fillColor: '#eeeeff',style:{bold:true,alignment:'center'}}],
    ]

    profile.subjectResultList.forEach(ob=>{
        console.log('****',ob)
        let record=[{text:ob.subName[ob.selectedIndx],style:{alignment:'center',bold:true}}]
        record.push({text:`${ob.theoryObtained}/${ob.theoryOutof}`,style:{alignment:'center',bold:true}})
        record.push({text:`${ob.practicalObtained}/${ob.practicalOutof}`,style:{alignment:'center',bold:true}})
        boardResultList.push(record)
    })
    let boardDetail={        
        table: {
            headerRows:0,    
            widths:['*','*','*'],
            body: boardResultList
        }
    }
    const footText=`I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief.`
    let form_number=profile?.id

    let reportDefination=[        
        {
            table:headerTbl1,
        },
        {
            margin:[0,5,0,0],            
            columns: [
                {margin:[10,0,10,0],text:`${form_number}`,style:{bold:true,alignment:'left',fontSize:11}}, 
                {margin:[10,0,10,0],text:`Applied For: ${config.admissionCategoryList.find(ob=>ob.alias==profile?.admission_category)?.category}`,style:{bold:true,alignment:'right',fontSize:11}},
            ]
        },
        {
            margin:[0,5,0,0],            
            columns: [
                admissionRecord,
                {
                    width: '121',
                    margin:[5,0,2,10],alignment:'right',canvas:[
                        {
                            type:'rect',
                            x:0,y:0,w:100,h:104
                        }]
                },
            ]
        },       

        separator('PERSONAL DETAILS'),     
        personalRecord,
        separator('ACADEMIC DETAILS'),     
        academicRecord, 
        separator('BOARD EXAM RESULT'),
        boardDetail,
        {margin:[0,5,0,14],text:footText,style:{fontSize:11,alignment:'justify',bold:false}},
		{margin:[0,0,0,0],text:"____________________",style:{alignment:'right',bold:true}},
		{margin:[0,0,0,0],text:"Signature",style:{alignment:'right',bold:true}}
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
        pdfMake.createPdf({pageOrientation:'portrait',
        content:reportDefination,
        defaultStyle:{fontSize:11}
        }).open()
}





const mqnri_recipt_print=async (id,selectedCategory,selectedBranch)=>{    
    const studentInfo=await getStudentInfo(id)
    const stuName=`${studentInfo.stuTitle} ${studentInfo.stuFirstname} ${studentInfo.stuMiddlename} ${studentInfo.stuLastname}`        
    const branchName=await getBranchName(selectedBranch)    
    const titleText=`SARDAR VALLABHBHAI PATEL INSTITUTE OF TECHNOLOGY, VASAD
                    MQ/NRI/NRI sponsored Admission Order `
    const headerTbl1={         
        headerRows:0,
        widths:[140,'*'],
        body:[
            [                
                {alignment:'center',fontSize:18,bold:true,text:titleText,colSpan:2},{text:''}
            ],
            [{bold:true,text:'Date:'},{text:`${new Date().toDateString()}`}],
            [{bold:true,text:'User ID:'},{text:`${studentInfo.formId}`}],
            [{bold:true,text:'Admission Category:'},{text:`${selectedCategory}`}],
            [{bold:true,text:'ACPC Merit Number:'},{text:`${studentInfo.stuACPC}`}],
            [{bold:true,text:'Name of Candidate:'},{text:`${stuName}`}],
            [{bold:true,text:'Fees to be Paid:'},{text:''}],
            [{bold:true,text:'Selected Branch:'},{text:`${branchName}`}],
            [{bold:true,fontSize:18,text:'Signature:'},{text:``}],
        ]
    }
    let reportDefination=[
        {
            table:headerTbl1,
        }        
    ]
    pdfMake.createPdf({content:reportDefination,pageOrientation: 'landscape',pageSize: 'A5'}).open()
}


const acpc_recipt_print=async (id,selectedCategory,selectedBranch)=>{}    
export {acpc_profile_print,acpc_recipt_print,mqnri_profile_print,mqnri_recipt_print,mqnri_profile_print1}

