<script>
    import { mesg,college } from '$lib/store.js'
    
    import {supabase} from "$lib/db"
    import { goto } from '$app/navigation'
    import { onMount } from 'svelte';
    import {createForm} from 'svelte-forms-lib'
    import * as yup from 'yup'
    export let data
    let branchList=[],sameAddrSelected=false
    const subjectList=['Mathematics','English','Computer','Chemistry','Physics']
    const subjectList1=['Mathematics','Chemistry','Physics']

    const validationSchema=yup.object().shape({
            course:yup.string().required(),
            branch:yup.string().required(),
            title:yup.string().required(),
            first_name:yup.string().required(),
            middle_name:yup.string().required(),
            last_name:yup.string().required(),
            contact:yup.number().required(),
            email:yup.string().email().required(),
            dob:yup.date().required(),
            gender:yup.string().required(),
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
            mother_name:yup.string().required(),
            mother_contact:yup.number().required(),
            mother_email:yup.string().email().required()
        })
    const {form,errors,handleChange,handleSubmit}=createForm({
        initialValues:{title:'Mr.',per_country:'INDIA'},        
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
            branchList=temp1?temp1.Branch:[]
        }
        if($form.title){
            $form.gender=($form.title=='Mr.')?'Male':'Female'
        }
    }
    onMount(()=>{
        if(data.formDt){      
            $form=data.formDt
        }
        else{
            $form.academic_year=data.academicYear.id
        }
    })
    const insertRecord=async(provFormInfo)=>{
        try{
            loading = true
            const { data, error } = await supabase
            .from('ProvFormInfo')
            .upsert([           
                provFormInfo
            ])
            if(error)
            {
                error_mesg=error.message     
                window.scrollTo(0,50)
                if(error instanceof Error){
                    error_mesg=error.message
                    $mesg=''
                }
            }
            else{
                error_mesg=''
                $mesg='Form Record Inserted/Updated Successully.'
                goto('/')
            }            
        } catch (error) {
            error_mesg=error.message
            window.scrollTo(0,50)
            if (error instanceof Error) {
                error_mesg=error.message
                $mesg=''
            }
        } finally {
            loading = false
        }
    }
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
</script>
{#if error_mesg}
        <div id="errormesg" class="w-full flex justify-between mt-2 mb-4 p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-orange-800 text-xl">{error_mesg}</div>
            <button on:click={()=>error_mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
{/if}    
<div class="flex justify-between items-center border-b px-4 pb-4">   
    <div class="text-slate-800 font-bold text-2xl text-center w-full">Management Quota/NRI Form - {data?.academicYear?.name}</div>
</div>






<form class="px-2 py-2" on:submit={handleSubmit}>
    <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Admission Details</div>
    <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
        <div class="flex justify-between p-1 lg:flex-row flex-col">          
            <div class="flex flex-col w-full m-1 px-2">
                <label for='mq' class="font-bold px-1">Select Admission Category</label>
                <div class="flex flex-row border border-blue-400 p-2 rounded">
                    <input type="checkbox" class="border w-4 p-2" id="mq"/><label class="mx-2 font-bold" for="mq">Management Quota (MQ)</label>
                    <input type="checkbox" class="border w-4 ml-5 p-2" id="nri"/><label class="mx-2 font-bold" for="nri">NRI Quota (NRI)</label>
                </div>
            </div>
            <div class="flex flex-col w-full m-1">
                <label for="course" class="font-bold">Select Course <span class="text-sm text-red-500">*</span></label>
                <select bind:value={$form.course} class:border-orange-700={$errors.course} class="input" type="text" name="course" id="course" required>
                    {#if data?.courselist}
                        {#each data?.courselist as course}
                            <option value={course.id}>{course.name}({course.alias})</option>
                        {/each}
                    {/if}
                </select> 
            </div>
            <!-- <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="branch">Select Branch <span class="text-sm text-red-500">*</span></label>
                <select bind:value={$form.branch} class:border-orange-700={$errors.branch} class="input" type="text" name="branch" id="branch" required>
                    <option value=""></option>
                    {#if branchList}
                        {#each branchList as branch}
                            <option value={branch.id}>{branch.name}({branch.alias})</option>
                        {/each}
                    {/if}
                </select>
            </div> -->
        </div>    
        <div class="flex justify-between px-2 py-1 lg:flex-row flex-col">
            <div class="flex flex-col w-full m-1">
                <label for="acpcnumber" class="font-bold">ACPC Application Number</label>    
                <input class="border rounded px-1 py-2 border-blue-400" type="text" id="acpcnumber">
            </div>
            <div class="flex flex-col w-full m-1">
                <label for="acpcmerit" class="font-bold">ACPC Merit Number</label>    
                <input class="border rounded px-1 py-2 border-blue-400" type="text" id="acpcmerit">
            </div>
            <div class="flex flex-col w-full m-1">
                <label for="gujcetnumber" class="font-bold">Entrance Exam Seat Number(GUJCET/NATA/NEET..)</label>    
                <input class="border rounded px-1 py-2 border-blue-400" type="text" id="gujcetnumber">
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
                <input on:blur={handleChange} bind:value={$form.first_name} name="first_name" class:border-orange-700={$errors.first_name} class="input" type="text" id="fname" required>               
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="mname">Midldle Name <span class="text-sm text-red-500">*</span></label>
                <input on:blur={handleChange} bind:value={$form.middle_name} name="middle_name" class:border-orange-700={$errors.middle_name} class="input" type="text" id="mname" required>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="lname">Last Name <span class="text-sm text-red-500">*</span></label>
                <input on:blur={handleChange} bind:value={$form.last_name} name="last_name" class:border-orange-700={$errors.last_name} class="input" type="text" id="lname" required>
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
            <div class="flex flex-col w-full m-1">
                <label for="file" class="font-bold">Upload Photo</label>
                <input type="file" name="" id="file">
            </div>
            <div class="flex flex-col w-full m-1">
            </div>
        </div>

        <div class="flex justify-between p-1 lg:flex-row flex-col">
            <div class="flex flex-col w-full m-1">      
                <label class="font-bold" for="bloodgrp">Blood Group</label>                
                <select on:blur={handleChange} bind:value={$form.contact} name="contact" class:border-orange-700={$errors.contact} class="input" type="text" id="bloodgrp">
                    <option value=""></option>
                    <option value=""></option>
                </select>
            </div>
            
            <div class="flex flex-col w-full m-1">      
                <label class="font-bold" for="religion">Religion</label>                
                <select on:blur={handleChange} bind:value={$form.contact} name="contact" class:border-orange-700={$errors.contact} class="input" type="text" id="religion">
                    <option value=""></option>
                    <option value=""></option>
                </select>
            </div>            
            <div class="flex flex-col w-full m-1">      
                <label class="font-bold" for="nationality">Nationality</label>                
                <select on:blur={handleChange} bind:value={$form.contact} name="contact" class:border-orange-700={$errors.contact} class="input" type="text" id="nationality">
                    <option value=""></option>
                    <option value=""></option>
                </select>
            </div>           
        </div>
        <div class="flex justify-between p-1 lg:flex-row flex-col">
            <div class="flex flex-col w-full m-1">      
                <label class="font-bold" for="category">Category</label>                
                <select on:blur={handleChange} bind:value={$form.contact} name="contact" class:border-orange-700={$errors.contact} class="input" type="text" id="category">
                    <option value=""></option>
                    <option value=""></option>
                </select>
            </div>       

            <div class="flex flex-col w-full m-1">      
                <label class="font-bold" for="caste">Caste</label>                
                <input on:blur={handleChange}  class:border-orange-700={$errors.dob} class="input" type="text" id="caste">                
            </div>  
            <div class="flex flex-col w-full m-1">      
                <label class="font-bold" for="aadharnumber">Aadhar Card Number <span class="text-sm text-red-500">*</span></label>                
                <input on:blur={handleChange}  class:border-orange-700={$errors.dob} class="input" type="text" id="aadharnumber" required>                
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
                        <input on:blur={handleChange} bind:value={$form.per_addr1} name="per_addr1" class:border-orange-700={$errors.per_addr1} class="input" type="text" id="addr_line1" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="addr_line2">Address Line2 </label>
                        <input on:blur={handleChange} bind:value={$form.per_addr2} name="per_addr2" class="input" type="text" id="addr_line2">
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="city">City <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.per_city} name="per_city" class:border-orange-700={$errors.per_city} class="input" type="text" id="city" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="state">State <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.per_state} name="per_state" class:border-orange-700={$errors.per_state} class="input" type="text" id="state" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="country">Country <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.per_country} name="per_country" class:border-orange-700={$errors.per_country} class="input" type="text" id="country" required>
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
                        <input on:blur={handleChange} bind:value={$form.present_addr1} name="present_addr1" class:border-orange-700={$errors.present_addr1} class="input" type="text" id="pre_Addr_line1" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_addr_line2">Address Line2 </label>
                        <input on:blur={handleChange} bind:value={$form.present_addr2} name="present_addr2" class="input" type="text" id="pre_addr_line2">
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_city">City <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.present_city} name="present_city" class:border-orange-700={$errors.present_city} class="input" type="text" id="pre_city" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_state">State <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.present_state} name="present_state" class:border-orange-700={$errors.present_state} class="input" type="text" id="pre_state" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_country">Country <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.present_country} name="present_country" class:border-orange-700={$errors.present_country} class="input" type="text" id="pre_country" required>
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
                    <label class="font-bold" for="guardian_name">Full Name <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.father_name} name="father_name" class:border-orange-700={$errors.father_name} class="input" type="text" id="guardian_name" required>
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian_number">Contact Number (Preferable WhatsApp) <span class="text-sm text-red-500">*</span></label>
                    
                    <input on:blur={handleChange} bind:value={$form.father_contact} name="father_contact" class:border-orange-700={$errors.father_contact} class="input" type="text" id="guardian_number" required>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian_email">Email <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.father_email} name="father_email" class:border-orange-700={$errors.father_email} class="input" type="text" id="guardian_email" required>
                </div>
                <div class="flex flex-col w-full m-1">      
                    <label class="font-bold" for="aadharnumber1">Aadhar Card Number <span class="text-sm text-red-500">*</span></label>                
                    <input on:blur={handleChange}  class:border-orange-700={$errors.dob} class="input" type="text" id="aadharnumber1" required>                
                </div>   
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="occupation">Occupation <span class="text-sm text-red-500">*</span></label>
                    <select name="occupation" class:border-orange-700={$errors.title} class="input" id="occupation" required>
                        <option></option>
                    </select>
                </div>                
            </div>
        </div>
        <div>
            <h2 class="px-2 font-bold text-xl border-t border-blue-500 mt-2 pt-2 underline">Mother Detail</h2>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_name">Full Name <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.mother_name} name="mother_name" class:border-orange-700={$errors.mother_name} class="input" type="text" id="guardian1_name" required>
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_number">Contact Number (Preferable WhatsApp) <span class="text-sm text-red-500">*</span></label>                    
                    <input on:blur={handleChange} bind:value={$form.mother_contact} name="mother_contact" class:border-orange-700={$errors.mother_contact} class="input" type="text" id="guardian1_number" required>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_email">Email <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.mother_email} name="mother_email" class:border-orange-700={$errors.mother_email} class="input" type="text" id="guardian1_email" required>
                </div>

                <div class="flex flex-col w-full m-1">      
                    <label class="font-bold" for="aadharnumber1">Aadhar Card Number</label>                
                    <input on:blur={handleChange}  class:border-orange-700={$errors.dob} class="input" type="text" id="aadharnumber1">                
                </div>   
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="occupation1">Occupation</label>
                    <select name="occupation1" class:border-orange-700={$errors.title} class="input" id="occupation1">
                        <option></option>
                    </select>
                </div>
            </div>


            <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Academic Details</div>
            <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label for="board" class="font-bold">Examination Board</label>                                                
                        <select class="border rounded px-1 py-2 border-blue-400" id="board">
                            <option value="Male">GSEB</option>
                            <option value="Female">CBSE</option>                            
                            <option value="Male">NIOS</option>
                            <option value="Female">ICSE</option>                            
                            <option value="Male">OTHER</option>
                        </select>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label for="examseat" class="font-bold">Examination Seat Number</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="examseat">
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label for="lastschool" class="font-bold">Last School Name</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="lastschool">
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label for="lastschoolcity" class="font-bold">Last School City</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="lastschoolcity">
                    </div>                    
                    </div>
                </div>
            </div>

            <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Board Examination Details</div>  
            <div class="text-indigo-800 overflow-x-auto">
                <table class="w-full bg-white">
                    <thead class="bg-blue-500 px-1 py-2 text-white">                        
                        <th class="w-1/2 px-1 py-2 border border-blue-400 border-t-white">Subject Name</th>
                        <th class="px-1 py-2 border border-blue-400 border-t-white">Theory (Obtained)</th>
                        <th class="px-1 py-2 border border-blue-400 border-t-white">Theory (Out of)</th>
                        <th class="px-1 py-2 border border-blue-400 border-t-white">Practical (Obtained)</th>
                        <th class="px-1 py-2 border border-blue-400 border-t-white">Practical (Out of)</th>
                    </thead>
                    <tbody class="w-full p-1 border text-center">
                        {#each subjectList as subject}
                            <tr>
                                <td class="w-1/2 border border-blue-400 p-1">{subject}</td>
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
                    </tbody>
                </table>
            </div>
            <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Entrance Examination Details</div>  
            <div class="text-indigo-800 overflow-x-auto">
                <table class="w-full bg-white">
                    <thead class="bg-blue-500 px-1 py-2 text-white">                        
                        <th class="px-1 py-2 border border-blue-400 border-t-white">Subject Name</th>
                        <th class="px-1 py-2 border border-blue-400 border-t-white">GUJCET</th>
                        <!-- <th class="px-1 py-2 border border-blue-400 border-t-white">JEE(Best of Two)</th> -->
                    </thead>
                    <tbody class="w-full p-1 border border-blue-400 text-center">
                        {#each subjectList1 as subject}                    
                            <tr>
                                <td class="w-1/2 border border-blue-400 p-1">{subject}</td>
                                <td class="p-1 border border-blue-400"><input class="w-full border hover:border-blue-400 rounded p-1" type="number"></td>
                                <!-- <td class="p-1 border border-blue-400"><input class="w-full border hover:border-blue-400 rounded p-1" type="number"></td> -->
                            </tr>
                        {/each}
                        <tr>
                            <td class="font-bold p-1 border border-blue-400" >Total</td>
                            <td class="p-1 border border-blue-400"><input type="number"></td>
                            <!-- <td class="p-1 border border-blue-400"><input type="number"></td> -->
                        </tr>
                    </tbody>
                </table>
            </div>
            


            <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Upload Documents</div>
            <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
                Lorem ipsum dolor sit amet.
            </div>
    </div>
    
    {#each Object.entries($errors) as [property,error]}    
        {#if error}
            <p class="bg-orange-400 text-white w-full text-sm mx-2 my-1 p-2 border">{error}</p>
        {/if}
    {/each}
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
