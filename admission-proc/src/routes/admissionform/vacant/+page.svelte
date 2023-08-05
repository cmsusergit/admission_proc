<script>
    import { mesg,college } from '$lib/store.js'
    
    import {supabase} from "$lib/db"
    import { onMount } from 'svelte';
    import {createForm} from 'svelte-forms-lib'
    import * as yup from 'yup'
    import config from '$lib/config.json'
    import Upload from '$lib/component/upload.svelte'
    import _ from 'lodash'
    export let data

    
    let sameAddrSelected=false,is_d2d=false
    let is_prov=false,prov_contact_number=''
    let subjectList=config.subjectList.find(ob=>ob.college_id==data?.college?.id)?.list
    let boardList=['SSC','HSC']
    let uploadFileList=[],branchList=[]
    let isSubmitted=false
    let total={'theoryObtained':0,'theoryOutof':0,'practicalObtained':0,'practicalOutof':0,'entranceRsultTotal':0}
    let subjectList1=config.subjectEntrList.find(ob=>ob.college_id==data?.college?.id)?.list
    // 
    // const subjectList1=['Mathematics','Chemistry','Physics']
    const validationSchema=yup.object().shape({
            admission_category:yup.string().required(),
            acpcnumber:yup.string().notRequired(),
            acpc_meritnumber:yup.string().notRequired(),
            course:yup.string().required(),
            entr_examnumber:yup.string().required(),
            title:yup.string().required(),
            first_name:yup.string().required(),
            middle_name:yup.string().required(),
            last_name:yup.string().required(),
            contact:yup.number().required(),
            email:yup.string().email().required(),
            dob:yup.date().required(),
            gender:yup.string().required(),
            photo:yup.string().notRequired(),
            blood_group:yup.string().notRequired(),
            religion:yup.string().notRequired(),
            nationality:yup.string().notRequired(),
            category:yup.string().notRequired(),
            caste:yup.string().notRequired(),
            aadharnumber:yup.number().required(),
            per_addr1:yup.string().required(),
            per_addr2:yup.string().notRequired(),
            per_city:yup.string().required(),
            per_state:yup.string().required(),
            per_country:yup.string().required(),
            per_zipcode:yup.number().required(),            
            present_addr1:yup.string().required(),
            present_addr2:yup.string().notRequired(),
            present_city:yup.string().required(),
            present_state:yup.string().required(),
            present_country:yup.string().required(),
            present_zipcode:yup.number().required(),       
            father_name:yup.string().required(),
            father_contact:yup.number().required(),
            father_email:yup.string().email().required(),
            father_aadharnumber:yup.number().required(),
            father_occupation:yup.string().required(),
            mother_name:yup.string().required(),
            mother_contact:yup.number().required(),
            mother_email:yup.string().email().notRequired(),
            mother_aadharnumber:yup.number().notRequired(),
            mother_occupation:yup.string().notRequired(),
            board_name:yup.string().notRequired(),
            exam_seatnumber:yup.string().notRequired(),
            last_schoolname:yup.string().notRequired(),
            last_schoolcity:yup.string().notRequired()
        })
    const {form,errors,handleChange,handleSubmit}=createForm({
        initialValues:{admission_category:'V',title:'Mr.',per_country:'INDIA'},        
        validationSchema:validationSchema,
        onSubmit:value=>{
            console.log(value)
            insertRecord(value)
        }
    })
    let error_mesg='',loading=false
    $:{
        if(data){
            college.set(data.college)      
        }
        if($form.course){
            const temp1=data.courselist.find(ob=>ob.id==$form.course)
            branchList=temp1?.Branch
        }
        if($form.title){
            $form.gender=($form.title=='Mr.')?'Male':'Female'
        }  
        if($form.subjectResultList){
            total['theoryObtained']=getTotal('theoryObtained')
            total['theoryOutof']=getTotal('theoryOutof')
            total['practicalObtained']=getTotal('practicalObtained')
            total['practicalOutof']=getTotal('practicalOutof')
        }
        if($form.entrnceExamDetail){
            total['entranceRsultTotal']=getEntrnceResultTotal()
        }
    }
    onMount(()=>{
        if(data.formDt){               
            $form=data.formDt
            uploadFileList=[]     
            _.forEach(data.uploadLabelList,record=>{                
                const uploadedFile =_.find(data.uploadFileList,ob=>ob.f_label_id==record.id)
                let temp1={
                    label:record.name,
                    f_label_id:record.id,
                    document_path:uploadedFile?uploadedFile.document_path:'',                                          
                    is_required:record.is_required,
                    f_form_id:data.formDt.id
                }
                if(uploadedFile){                    
                    temp1['id']=uploadedFile.id
                }
                uploadFileList.push(temp1)
            })            
        }
        else{
            $form.academic_year=data.academicYear.id
            $form.college_id=data.college.id    
            console.log('----',$form);
            $form.admission_category="V"
            $form.boardList=[]
            _.forEach(boardList,ob=>{
                $form.boardList.push({board:ob,result:0.0})
            })   
            $form.subjectResultList=[]
            _.forEach(subjectList,ob=>{
                $form.subjectResultList.push({subName:ob.subList,selectedIndx:ob.selected,theoryObtained:0.0,theoryOutof:100.0,practicalObtained:0.0,practicalOutof:50.0})
            })   
            $form.entrnceExamDetail=[]
            _.forEach(subjectList1,ob=>{
                $form.entrnceExamDetail.push({subName:ob,gujcetReult:0.0})
            })   
            fetchUploadFileList()
            }
    })

    const fetchUploadFileList=async()=>{
        uploadFileList=[]
        _.forEach(data?.uploadLabelList,label=>{
            let temp1={
                label:label.name,
                f_label_id:label.id,
                document_path:'',
                is_required:label.is_required
            }
            uploadFileList.push(temp1)
        })
    }
    function uppercase(node) {
		const transform = () => node.value = node.value.toUpperCase()		
		node.addEventListener('input', transform, { capture: true })		
		transform()
	}
    const getEntrnceResultTotal=()=>{
        let total=0        
        for (let indx = 0; indx < $form.entrnceExamDetail.length; indx++) {
            total+=$form.entrnceExamDetail[indx]['gujcetReult']            
        }
        return total
    }
    const getTotal=(id)=>{
        let total=0        
        for (let indx = 0; indx < $form.subjectResultList.length; indx++) {
            total+=$form.subjectResultList[indx][id]            
        }
        return total
    }    

    const insertRecord=async(record)=>{
        try{
            loading = true
            const { data:dt, error:err1 } = await supabase
            .from('VacantFormInfo')
            .upsert(record)
            .select('id')
            console.log(dt,err1)
            if(err1)
            {
                error_mesg=error.message     
                window.scrollTo(0,50)
                if(err1 instanceof Error){
                    error_mesg=err1.message
                    $mesg=''
                }
                return
            }
            else{                
                let tempUploadList=[]
                uploadFileList.forEach((file1)=>{
                    console.log(file1);
                    const temp={             
                        f_form_id:dt[0].id,
                        f_label_id:file1.f_label_id,
                        document_path:file1.document_path                        
                    }
                    if(file1.id)
                        temp['id']=file1.id
                    tempUploadList.push(temp)
                })    
                console.log(tempUploadList);
                const { data:data1, error:error1 } = await supabase
                    .from('AdmissionDocumentVacant')
                    .upsert(tempUploadList)
                if(error1){                    
                    console.log(error1)
                    error_mesg=error1
                    return
                }
                error_mesg=''
                $mesg='Form Record Inserted/Updated Successully.'    
                if(!data.formDt){  
                    const tempD1=new Date($form.dob)                    
                    let pwd1=(''+tempD1.getDate()).padStart(2,'0')+(''+(tempD1.getMonth()+1)).padStart(2,'0')+tempD1.getFullYear()

                    const { data, error } = await supabase.auth.signUp({
                        email: $form.email,
                        password:pwd1,
                        email_confirm: true
                    })

                    if(error){
                        console.log(error)
                        return
                    }
                }
                // if(error){                    
                //     console.log(error)
                // }
                // else{
                //     const { data, error } = await supabase.auth.resetPasswordForEmail($form.email)
                // }
            }            
        } catch (error) {
            error_mesg=error.message
            window.scrollTo(0,50)
            $mesg=''
            return
        } finally {
            loading = false
        }
        isSubmitted=true
    }
    // const uploadfile=(file,labelId)=>{
    //     uploadFileList=[...uploadFileList ,{f_label_id:labelId,document_path:file.detail}]//....
    //     console.log(file.detail)
    // }
    const onSameAddrChanged=()=>{
        if(sameAddrSelected){
            $form.present_addr1=$form.per_addr1
            $form.present_addr2=$form.per_addr2
            $form.present_city=$form.per_city
            $form.present_state=$form.per_state
            $form.present_country=$form.per_country
            $form.present_zipcode=$form.per_zipcode
        }        
        else{
            $form.present_addr1=''
            $form.present_addr2=''
            $form.present_city=''
            $form.present_state=''
            $form.present_country='' 
            $form.present_zipcode=''
        }
    } 
    const removeFile= async(file1)=>{
        const { data, error } = await supabase
            .from('AdmissionDocumentVacant')
            .update({document_path:''})
            .eq('id', file1.id)
        if(error){
            console.log(error)
            error_mesg=error
            return
        }      
        let temp1=[]
        _.forEach(uploadFileList,ob=>{
            if(ob.id==file1.id)
                ob.document_path=null
            temp1.push(ob)
        })        
        uploadFileList=[...temp1]//....
        //....
        console.log(file1);
    }
    
    
    
    
    
    const fetchProvDt=async()=>{
        try{
            loading=true
            let { data: provFormInfo, error } = await supabase
                .from('ProvFormInfo')
                .select('*').eq('contact',prov_contact_number).single()
            
            if(!provFormInfo){
                handleReset()
                return
            }
            const temp1=_.omit(provFormInfo,["id","is_removed","is_approved","approved_by","form_number"])
            for(const record in temp1){
                $form[record]=temp1[record]
            }
        }catch(error1){
            error_mesg=error1
            console.log('****',error1)

        }finally{

            loading=false
        }
    }
    const processBoardList=(is_d2d)=>{
        $form.is_d2d=is_d2d
        if(is_d2d){            
            $form.boardList=[]
            _.forEach(boardList,ob=>{
                $form.boardList.push({board:ob,result:0.0})
            })   
            $form.boardList.push({board:"Diploma (Sem-5)",result:0.0})
            $form.boardList.push({board:"Diploma (Sem-6)",result:0.0})            
            
            
            uploadFileList=_.forEach(uploadFileList,ob=>{
                if(ob?.label?.toString().includes("GATE (In Case of Application for ME)")){
                    ob['label']="Diploma All Year Marksheets (1 File)"
                }
                
                if(ob?.label?.toString().includes("GUJCET (In case of Application for BE)")){
                    ob['label']="Diploma Degree/Provisional Certificate"
                }                
            })
        }else if(!is_d2d){
            $form.boardList=[]
            _.forEach(boardList,ob=>{
                $form.boardList.push({board:ob,result:0.0})
            })            
            fetchUploadFileList()
        }
    }    
</script>
{#if error_mesg}
        <div id="errormesg" class="w-full flex justify-between mt-2 mb-4 p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-orange-800 text-xl">{error_mesg}</div>
            <button on:click={()=>error_mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
{/if}    
<div class="flex justify-between items-center border-b px-4 pb-4">   
    <div class="text-slate-800 font-bold text-2xl text-center w-full">Vacant Form - {data?.academicYear?.name}</div>
</div>
{#if isSubmitted}
    <div class="min-h-[500] w-full">
        <h1 class="bg-white text-2xl text-slate-800 text-center font-bold p-4">Thank You for submitting a form, Check Your Email for confirmation</h1>
        <div class="my-4 text-lg text-center text-blue-700 hover:text-blue-500">
            To Proceed For Payment: <a href='https://pmny.in/kIDcWXiuJGZz'>Click Here</a>
        </div>
    </div>
{:else}
        <div class="bg-slate-500 text-white p-2 m-2 justify-center text-lg flex items-center">
            <input bind:checked={is_prov} type="checkbox" class="w-8 h-4" id="id_prov">
            <label for="id_prov">Is Provisional Admission Given?</label>
        </div> 
        {#if is_prov}
            <div class="flex flex-col w-full m-1">
                <label for="prov_contact_number" class="font-bold">Provisional Contact Number</label>
                <input on:blur={fetchProvDt} bind:value={prov_contact_number}  class="border rounded px-1 py-2 border-blue-400" type="text" id="prov_contact_number">
            </div>
        {/if}
    <form class="text-sm p-2" on:submit={handleSubmit}>
        <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Admission Details</div>
        <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
            <div class="flex justify-between p-1 lg:flex-row flex-col">          
                <div class="flex flex-col w-1/2 m-1 px-2">
                    <label for='mq' class="font-bold px-1">Admission Category</label>
                    <div class="flex flex-row border border-blue-400 p-2 rounded">
                        <label class="mx-2 font-bold" for="vacant">Vacant</label>
                    </div>
                </div>
                <div class="flex flex-col w-full md:w-1/2 m-1 px-1">
                    <label for='isd2d' class="font-bold px-1">D2D Admission</label>
                    <div class="flex flex-row border border-blue-400 p-2 rounded">
                        <input type="checkbox" bind:checked={is_d2d} on:change={(event)=>processBoardList(is_d2d)} class="border w-4 p-2" id="isd2d"/><label class="mx-2 font-bold" for="isd2d">Is D2D?</label>
                    </div>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label for="course" class="font-bold">Select Course <span class="text-sm text-red-500">*</span></label>
                    <select bind:value={$form.course} class:border-orange-700={$errors.course} class="input" type="text" name="course" id="course" required>
                        {#if data?.courselist}
                            {#each data?.courselist as course}
                                {#if course.is_mqnri==true}
                                    <option value={course.id}>{course.name}({course.alias})</option>
                                {/if}
                            {/each}
                        {/if}
                    </select> 
                </div>        
                <div class="flex flex-col w-full m-1 px-2">                    
                        <label for="course" class="font-bold">Select Branch <span class="text-sm text-red-500">*</span></label>
                        <select bind:value={$form.branch} class:border-orange-700={$errors.branch} class="input" type="text" name="admissioncategory" id="admissioncategory" required>
                            {#if branchList}
                                {#each branchList as record}
                                    <option value={record.id}>{record.name}({record.alias})</option>
                                {/each}
                            {/if}
                        </select>
                </div>                  
            </div>    
            <div class="flex justify-between px-2 py-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label for="acpcnumber" class="font-bold">ACPC Application Number</label>    
                    <input bind:value={$form.acpcnumber}  class="border rounded px-1 py-2 border-blue-400" type="text" id="acpcnumber">
                </div>
                <div class="flex flex-col w-full m-1">
                    <label for="acpc_meritnumber" class="font-bold">ACPC Merit Number</label>    
                    <input on:blur={handleChange} bind:value={$form.acpc_meritnumber} class:border-orange-700={$errors.acpc_meritnumber} class="border rounded px-1 py-2 border-blue-400" type="text" name="acpc_meritnumber" id="acpc_meritnumber">
                </div>
                <div class="flex flex-col w-full m-1">
                    <label for="entr_examnumber" class="font-bold">Entrance Exam Seat Number(GUJCET/NATA/NEET..)<span class="text-sm text-red-500">*</span> </label>    
                    <input on:blur={handleChange} bind:value={$form.entr_examnumber} class:border-orange-700={$errors.entr_examnumber} class="border rounded px-1 py-2 border-blue-400" type="text" name="entr_examnumber" id="entr_examnumber" required>
                </div>
            </div>               
        </div>

        <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-800 rounded-t-lg md:w-1/4">Personal Details</div>
        <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400">
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex m-1 flex-col w-48">
                    <label class="font-bold" for="title">Title <span class="text-sm text-red-500">*</span></label>
                    <select bind:value={$form.title} name="title" class:border-orange-700={$errors.title} class="input" type="text" id="title" required>
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Mrs.</option>
                    </select>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="fname">First Name <span class="text-sm text-red-500">*</span></label>
                    <input use:uppercase on:blur={handleChange} bind:value={$form.first_name} name="first_name" class:border-orange-700={$errors.first_name} class="input" type="text" id="fname" required>               
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="mname">Midldle Name <span class="text-sm text-red-500">*</span></label>
                    <input use:uppercase on:blur={handleChange} bind:value={$form.middle_name} name="middle_name" class:border-orange-700={$errors.middle_name} class="input" type="text" id="mname" required>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="lname">Last Name <span class="text-sm text-red-500">*</span></label>
                    <input use:uppercase on:blur={handleChange} bind:value={$form.last_name} name="last_name" class:border-orange-700={$errors.last_name} class="input" type="text" id="lname" required>
                </div>

            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="contact">Contact Number (Preferable WhatsApp) <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.contact} name="contact" class:border-orange-700={$errors.contact} class="input" type="text" id="contact" >
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="email">Email <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.email} name="email" class:border-orange-700={$errors.email} class="input" type="text" id="email" >
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">                
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="dob">Birth Date <span class="text-sm text-red-500">*</span></label>               
                    <input on:blur={handleChange} bind:value={$form.dob} name="dob" class:border-orange-700={$errors.dob} class="input" type="date" id="dob" required>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="gender">Gender <span class="text-sm text-red-500">*</span></label>
                    <select bind:value={$form.gender} name="gender" class:border-orange-700={$errors.gender} class="input" type="text" id="title" required>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <div class="w-full m-1">
                    <Upload bind:url={$form.photo} is_image=true label="Upload Photo"/>
                    <!-- <label for="file" class="font-bold">Upload Photo</label>
                    <input type="file" name="" id="file"> -->
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">      
                    <label class="font-bold" for="bloodgrp">Blood Group</label>                
                    <select bind:value={$form.blood_group} name="bloodGroup" class="input" id="bloodgrp">
                        <option value="-">-</option>
                        {#each config.bloodGroupList as bGroup}
                            <option>{bGroup}</option>
                        {/each}
                    </select>
                </div>            
                <div class="flex flex-col w-full m-1">      
                    <label class="font-bold" for="religion">Religion</label>                  
                    <select bind:value={$form.religion} name="religion" class="input" id="religion">
                        {#each  config.religionList as record}                        
                            <option>{record}</option>
                        {/each}
                    </select>
                </div>            
                <div class="flex flex-col w-full m-1">      
                    <label class="font-bold" for="nationality">Nationality</label>                
                    <select bind:value={$form.nationality} name="nationality" class="input" id="nationality">
                        {#each config.nationalityList as record}                        
                            <option>{record}</option>
                        {/each}
                    </select>
                </div>           
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">      
                    <label class="font-bold" for="category">Category</label>                
                    <select bind:value={$form.category} name="category" class="input" id="category">
                        {#each config.categoryList as category}
                            <option>{category}</option>
                        {/each}
                    </select>
                </div>    
                <div class="flex flex-col w-full m-1">      
                    <label class="font-bold" for="caste">Caste</label>                
                    <input bind:value={$form.caste} class="input" use:uppercase type="text" id="caste">                
                </div>  
                <div class="flex flex-col w-full m-1">      
                    <label class="font-bold" for="aadharnumber">Aadhar Card Number <span class="text-sm text-red-500">*</span></label>                
                    <input on:blur={handleChange} bind:value={$form.aadharnumber}  class="input" class:border-orange-700={$errors.aadharnumber} type="text" id="aadharnumber" required>                
                </div>  
            </div>
        </div>
        <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-800 rounded-t-lg md:w-1/4">Address Details</div>
        <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
            <div class="">
                <div>
                    <h2 class="px-2 font-bold underline text-xl">Permanent Address</h2>
                    <div class="flex justify-between p-1 lg:flex-row flex-col">

                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="addr_line1">Address Line1 <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.per_addr1} name="per_addr1" class:border-orange-700={$errors.per_addr1} use:uppercase class="input" type="text" id="addr_line1" required>
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="addr_line2">Address Line2 </label>
                            <input on:blur={handleChange} bind:value={$form.per_addr2} name="per_addr2" use:uppercase class="input" type="text" id="addr_line2">
                        </div>
                    </div>
                    <div class="flex justify-between p-1 lg:flex-row flex-col">
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="city">City <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.per_city} name="per_city" class:border-orange-700={$errors.per_city} use:uppercase class="input" type="text" id="city" required>
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="state">State <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.per_state} name="per_state" class:border-orange-700={$errors.per_state} use:uppercase class="input" type="text" id="state" required>
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="country">Country <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.per_country} name="per_country" class:border-orange-700={$errors.per_country} use:uppercase class="input" type="text" id="country" required>
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="zipcode">ZipCode <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.per_zipcode} name="per_zipcode" class:border-orange-700={$errors.per_zipcode} class="input" type="text" id="zipcode" required>
                        </div>
                    </div>
                </div>
                <div class="border-t border-b px-2 mt-2 bg-gray-100 border-blue-500 py-2">                
                    <input bind:checked={sameAddrSelected} on:change={onSameAddrChanged} type="checkbox" class="border w-4 p-2" id="sameaddr"><label class="mx-2 font-bold" for="sameaddr">Same as Above <span class="text-sm text-red-500">*</span></label>
                </div>
                <div>
                    <h2 class="px-2 mt-2 font-bold text-xl underline">Present Address</h2>
                    <div class="flex justify-between p-1 lg:flex-row flex-col">
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="pre_addr_line1">Address Line1 <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.present_addr1} name="present_addr1" class:border-orange-700={$errors.present_addr1} use:uppercase class="input" type="text" id="pre_Addr_line1" required>
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="pre_addr_line2">Address Line2 </label>
                            <input on:blur={handleChange} bind:value={$form.present_addr2} name="present_addr2" use:uppercase class="input" type="text" id="pre_addr_line2">
                        </div>
                    </div>
                    <div class="flex justify-between p-1 lg:flex-row flex-col">
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="pre_city">City <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.present_city} name="present_city" class:border-orange-700={$errors.present_city} use:uppercase class="input" type="text" id="pre_city" required>
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="pre_state">State <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.present_state} name="present_state" class:border-orange-700={$errors.present_state} use:uppercase class="input" type="text" id="pre_state" required>
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="pre_country">Country <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.present_country} name="present_country" class:border-orange-700={$errors.present_country} use:uppercase class="input" type="text" id="pre_country" required>
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label class="font-bold" for="pre_zipcode">ZipCode <span class="text-sm text-red-500">*</span></label>
                            <input on:blur={handleChange} bind:value={$form.present_zipcode} name="present_zipcode" class:border-orange-700={$errors.present_zipcode} class="input" type="text" id="pre_zipcode" required>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-800 rounded-t-lg md:w-1/4">Guardian Details</div>    
        <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
            <div>
                <h2 class="px-2 font-bold text-xl underline">Father/Guardian Detail</h2>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="father_name">Full Name <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.father_name} name="father_name" class:border-orange-700={$errors.father_name} use:uppercase class="input" type="text" id="father_name" required>
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="father_number">Contact Number (Preferable WhatsApp) <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.father_contact} name="father_contact" class:border-orange-700={$errors.father_contact} class="input" type="text" id="father_number" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="father_email">Email <span class="text-sm text-red-500">*</span></label>
                        <input name="father_email" on:blur={handleChange} bind:value={$form.father_email} class:border-orange-700={$errors.father_email} class="input" type="text" id="father_email" required>
                    </div>
                    <div class="flex flex-col w-full m-1">      
                        <label class="font-bold" for="father_aadharnumber">Aadhar Card Number <span class="text-sm text-red-500">*</span></label>                
                        <input name="father_aadharnumber" on:blur={handleChange} bind:value={$form.father_aadharnumber} class:border-orange-700={$errors.father_aadharnumber} class="input" type="text" id="father_aadharnumber" required>                
                    </div>   
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="father_occupation">Occupation <span class="text-sm text-red-500">*</span></label>
                        <select name="father_occupation" on:blur={handleChange} bind:value={$form.father_occupation} class:border-orange-700={$errors.father_occupation} class="input" id="father_occupation" required>
                            <option value=""></option>
                            {#each config.occupationList as occupation}                            
                                <option>{occupation}</option>
                            {/each}
                        </select>
                    </div>                
                </div>
            </div>
            <div>
                <h2 class="px-2 font-bold text-xl border-t border-blue-500 mt-2 pt-2 underline">Mother Detail</h2>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="mother_name">Full Name <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.mother_name} name="mother_name" class:border-orange-700={$errors.mother_name} use:uppercase class="input" type="text" id="mother_name" required>
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="mother_contact">Contact Number (Preferable WhatsApp) <span class="text-sm text-red-500">*</span></label>                    
                        <input on:blur={handleChange} bind:value={$form.mother_contact} name="mother_contact" class:border-orange-700={$errors.mother_contact} class="input" type="text" id="mother_contact" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="mother_email">Email</label>
                        <input bind:value={$form.mother_email} name="mother_email" class="input" type="text" id="mother_email">
                    </div>
                    <div class="flex flex-col w-full m-1">      
                        <label class="font-bold" for="mother_aadharnumber">Aadhar Card Number</label>                
                        <input bind:value={$form.mother_aadharnumber} name="mother_aadharnumber" class="input" type="text" id="mother_aadharnumber">                
                    </div>   
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="mother_occupation">Occupation</label>
                        <select name="mother_occupation" class="input" id="mother_occupation">
                            <option value=""></option>
                            {#each config.occupationList as occupation}
                                <option>{occupation}</option>
                            {/each}
                        </select>
                    </div>
                </div>
                <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Academic Details</div>
                <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
                    <div class="flex justify-between p-1 lg:flex-row flex-col">
                        <div class="flex flex-col w-full m-1">
                            <label for="board" class="font-bold">Examination Board</label>                                                
                            <select bind:value={$form.board_name} class="border rounded px-1 py-2 border-blue-400" id="board">
                                {#each config.examinationBoardList as record}                                
                                    <option>{record}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label for="examseat" class="font-bold">Examination Seat/Enrollment Number</label>
                            <input bind:value={$form.exam_seatnumber} class="border rounded px-1 py-2 border-blue-400" type="text" id="examseat">
                        </div>
                    </div>
                    <div class="flex justify-between p-1 lg:flex-row flex-col">
                        <div class="flex flex-col w-full m-1">
                            <label for="lastschool" class="font-bold">Last School Name</label>
                            <input bind:value={$form.last_schoolname} class="border rounded px-1 py-2 border-blue-400" type="text" id="lastschool">
                        </div>
                        <div class="flex flex-col w-full m-1">
                            <label for="lastschoolcity" class="font-bold">Last School City</label>
                            <input bind:value={$form.last_schoolcity} class="border rounded px-1 py-2 border-blue-400" type="text" id="lastschoolcity">
                        </div>                    
                    </div>
                </div>
                <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Board Examination Details</div>  
                <div class="text-indigo-800 overflow-x-auto">
                    <table class="w-full bg-white">
                        <thead class="bg-blue-500 px-1 py-2 text-white">                        
                            <th class="w-1/2 px-1 py-2 border border-blue-400 border-t-white">Course/Examination Name</th>
                            <th class="px-1 py-2 border border-blue-400 border-t-white">Result/Grade (Percentage)</th>
                        </thead>
                        <tbody class="w-full p-1 border text-center">                        
                            {#if $form.boardList}
                                {#each $form.boardList as board}
                                    <tr>
                                        <td class="w-1/2 border border-blue-400 p-1">{board.board}</td>
                                        <td class="p-1 border border-blue-400">
                                            <input bind:value={board.result} type="number" step='0.01' class="w-full border hover:border-blue-400 rounded p-1">
                                        </td>
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
                <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Board Subject Details</div>  
                <div class="text-indigo-800 overflow-x-auto">
                    {#if $form.subjectResultList}
                        <table class="w-full bg-white">
                            <thead class="bg-blue-500 px-1 py-2 text-white">                        
                                <th class="w-1/2 px-1 py-2 border border-blue-400 border-t-white">Subject Name</th>
                                <th class="px-1 py-2 border border-blue-400 border-t-white">Theory (Obtained)</th>
                                <th class="px-1 py-2 border border-blue-400 border-t-white">Theory (Out of)</th>
                                <th class="px-1 py-2 border border-blue-400 border-t-white">Practical (Obtained)</th>
                                <th class="px-1 py-2 border border-blue-400 border-t-white">Practical (Out of)</th>
                            </thead>
                            <tbody class="w-full p-1 border text-center">
                                {#each $form.subjectResultList as subject,indx}
                                    <tr>
                                        <td class="w-1/2 border border-blue-400 p-1">  
                                            {#if subject.subName.length>1}
                                                    <div class="flex flex-col md:flex-row justify-center">
                                                        {#each subject.subName as subjectEntry,indx1}
                                                            <span>
                                                                <input on:change={()=>{subject.selectedIndx=indx1}} checked={indx1==subject.selectedIndx} type="radio" name={indx} class="border w-4 p-2" id={subjectEntry}/>
                                                                <label for={subjectEntry} class="mx-2">{subjectEntry}</label>                                                                                                
                                                            </span>
                                                        {/each}
                                                    </div>
                                            {:else}
                                                {subject.subName[0]}
                                            {/if}
                                        </td>
                                        <td class="p-1 border border-blue-400"><input bind:value={subject.theoryObtained} type="number" step='0.01' class="w-full border hover:border-blue-400 rounded p-1"></td>
                                        <td class="p-1 border border-blue-400"><input bind:value={subject.theoryOutof} type="number" step='0.01' class="w-full border hover:border-blue-400 rounded p-1"></td>
                                        <td class="p-1 border border-blue-400"><input bind:value={subject.practicalObtained} type="number" step='0.01' class="w-full border hover:border-blue-400 rounded p-1"></td>
                                        <td class="p-1 border border-blue-400"><input bind:value={subject.practicalOutof} type="number" step='0.01' class="w-full border hover:border-blue-400 rounded p-1"></td>
                                    </tr>
                                {/each}
                                <tr>
                                    <td class="w-1/2 font-bold p-1 border border-blue-400" >Total</td>
                                    <td class="py-1 border border-blue-400 px-1">{total['theoryObtained']}</td>
                                    <td class="py-1 border border-blue-400 px-1">{total['theoryOutof']}</td>
                                    <td class="py-1 border border-blue-400 px-1">{total['practicalObtained']}</td>
                                    <td class="py-1 border border-blue-400 px-1">{total['practicalOutof']}</td>
                                </tr>
                            </tbody>
                            <!-- <tbody class="w-full p-1 border text-center">
                                {#each subjectList as subject,indx}
                                    <tr>
                                        <td class="w-1/2 border border-blue-400 p-1">                                
                                            {#if subject.length>1}
                                                    <div class="flex flex-col md:flex-row justify-center">
                                                        {#each subject as subjectEntry,indx1}
                                                            <span>
                                                                <input checked={indx1==0} type="radio" name={indx} class="border w-4 p-2" id={subjectEntry}/><label for={subjectEntry} class="mx-2">{subjectEntry}</label>                                                                                                
                                                            </span>
                                                        {/each}
                                                    </div>
                                            {:else}
                                                {subject[0]}
                                            {/if}
                                        </td>
                                        <td class="p-1 border border-blue-400"><input type="number" class="w-full border hover:border-blue-400 rounded p-1"></td>
                                        <td class="p-1 border border-blue-400"><input type="number" class="w-full border hover:border-blue-400 rounded p-1"></td>
                                        <td class="p-1 border border-blue-400"><input type="number" class="w-full border hover:border-blue-400 rounded p-1"></td>
                                        <td class="p-1 border border-blue-400"><input type="number" class="w-full border hover:border-blue-400 rounded p-1"></td>
                                    </tr>
                                {/each}
                                <tr>
                                    <td class="w-1/2 font-bold p-1 border border-blue-400" >Total</td>
                                    <td class="py-1 border border-blue-400 px-1"></td>
                                    <td class="py-1 border border-blue-400 px-1"></td>
                                    <td class="py-1 border border-blue-400 px-1"></td>
                                    <td class="py-1 border border-blue-400 px-1"></td>
                                </tr>
                            </tbody> -->
                        </table>
                    {/if}
                </div>
                {#if !$form.is_d2d}
                    <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Entrance Examination Details</div>  
                    <div class="text-indigo-800 overflow-x-auto">
                        {#if $form.entrnceExamDetail}
                            <table class="w-full bg-white">
                                <thead class="bg-blue-500 px-1 py-2 text-white">                        
                                    <th class="px-1 py-2 border border-blue-400 border-t-white">Subject Name</th>
                                    <th class="px-1 py-2 border border-blue-400 border-t-white">RESULT</th>
                                    <!-- <th class="px-1 py-2 border border-blue-400 border-t-white">JEE(Best of Two)</th> -->
                                </thead>
                                <tbody class="w-full p-1 border border-blue-400 text-center">
                                    {#each $form.entrnceExamDetail as subject}                    
                                        <tr>
                                            <td class="w-1/2 border border-blue-400 p-1">{subject.subName}</td>
                                            <td class="p-1 border border-blue-400">
                                                <input bind:value={subject.gujcetReult} step='0.01' class="w-full border hover:border-blue-400 rounded p-1" type="number">
                                            </td>
                                            <!-- <td class="p-1 border border-blue-400"><input class="w-full border hover:border-blue-400 rounded p-1" type="number">
                                            </td> -->
                                        </tr>
                                    {/each}
                                    <tr>
                                        <td class="font-bold p-1 border border-blue-400" >Total</td>
                                        <td class="p-1 border border-blue-400">{total['entranceRsultTotal']}</td>
                                        <!-- <td class="p-1 border border-blue-400"><input type="number">
                                        </td> -->
                                    </tr>

                                </tbody>
                            </table>
                        {/if}
                    </div>
                {/if}
                <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Upload Documents</div>
                <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
                    <div class="grid gap-2 md:grid-cols-2 grid-cols-1">
                        
                        {#each uploadFileList as uploadFile}    
                            <!-- <Upload on:removeFile={()=>removeFile(uploadFile)} bind:url={uploadFile.document_path} label={uploadFile.label} required={uploadFile.is_required}/>  
                                -->                               
                            <Upload on:removeFile={()=>removeFile(uploadFile)} bind:url={uploadFile.document_path} label={uploadFile.label}/> 
                        {/each}
                    </div>
                </div>           
        </div>
        <!-- {#if !data.formDt}
            <div class="flex justify-start border md:flex-row px-4 mt-4 flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
                <div class="flex flex-row">
                    <input type="checkbox" bind:checked={isConditionAccepted} class="border w-4 p-2" id="document1"/>
                    <label class="mx-2 font-bold" for="document1">Accept <a target="_blank" class="underline text-orange-800" href="https://mhazmbcbujixalspvqrz.supabase.co/storage/v1/object/public/document/TC.pdf?t=2023-04-12T08%3A49%3A14.048Z">Terms and Conditions</a></label>
                </div>
                <div class="flex flex-row">
                    <input type="checkbox" bind:checked={isAICTEAccepted} class="border w-4 p-2" id="document2"/>
                    <label class="mx-2 font-bold" for="document2">Accept <a target="_blank" class="underline text-orange-800" href="https://mhazmbcbujixalspvqrz.supabase.co/storage/v1/object/public/document/TC.pdf?t=2023-04-12T08%3A49%3A14.048Z">AICTE Anti-Ragging Affidavit</a></label>
                </div>
            </div>
        {/if} -->
        {#each Object.entries($errors) as [property,error]}    
            {#if error}
                <p class="bg-orange-400 text-white w-full text-sm mr-2 my-1 p-2 border">{error}</p>
            {/if}
        {/each}
        <div class="flex justify-end border flex-row border-blue-400 p-4 mt-4 bg-white shadow shadow-slate-400 rounded">
            {#if data.formDt}
                <button disabled={loading} type="submit" class="w-48 button-primary">
                    {#if loading}
                        Please Wait....
                    {:else}
                        Submit
                    {/if}
                </button>
            {:else}
                <!-- <button disabled={loading || !isAICTEAccepted || !isConditionAccepted} type="submit" class="w-48 button-primary">
                    {#if loading}
                        Please Wait....
                    {:else}
                        Submit
                    {/if}
                </button> -->
                <button disabled={loading } type="submit" class="w-48 button-primary">
                    {#if loading}
                        Please Wait....
                    {:else}
                        Submit
                    {/if}
                </button>
            {/if}
        </div>
    </form>
{/if}












