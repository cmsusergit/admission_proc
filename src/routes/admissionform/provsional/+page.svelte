<script>
    import { mesg,college } from '$lib/store.js'
    
    import {supabase} from "$lib/db"
    import { goto } from '$app/navigation'
    import { onMount } from 'svelte';   
    import {createForm} from 'svelte-forms-lib'
    import { env } from '$env/dynamic/public'
    import * as yup from 'yup'
    import Modal from '$lib/modal.svelte'
    import { createEventDispatcher } from 'svelte';


    export let data
    let branchList=[],sameAddrSelected=false    
    let isDlgOpen=false
    let inquiry_contact='1001'
    const validationSchema=yup.object().shape({
            course:yup.string().required(),
            is_d2d:yup.boolean().required(),
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
    const dispatch= createEventDispatcher()
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
            $form.is_d2d=false
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
    function uppercase(node) {
		const transform = () => node.value = node.value.toUpperCase()		

		node.addEventListener('input', transform, { capture: true })		
		transform()
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
    const fetchProvDt=async()=>{
        try{
            loading=true
            const option={
                    method: 'GET',mode: 'cors'
                }                
            let url1=`${env.PUBLIC_INQUERY_URL}/inquery/detailbycontact?mobile=${inquiry_contact}`
            console.log(url1);
            const dt = await fetch(url1,{headers:option})
            if(dt.status==200){
                const rr=await dt.json()
                if(rr.found){
                    $form.title=rr.dt[0].title
                    $form.first_name=rr.dt[0].first_name?.toUpperCase()
                    $form.middle_name=rr.dt[0].middle_name?.toUpperCase()
                    $form.last_name=rr.dt[0].last_name?.toUpperCase()
                    $form.contact=rr.dt[0].mobile
                    $form.email=rr.dt[0].email
                    $form.per_addr1=rr.dt[0].address                    
                    $form.per_city=rr.dt[0].city

                }
                else{
                    error_mesg="Record For Enquiry Nt Found"
                }
            }
            else{alert("Something Wrong!!!!")
            }
        }catch(error1){
            error_mesg=error1
            alert("Something Wrong!!!!"+error1)
            console.log('****',error1)

        }finally{
            loading=false
        }
    }
</script>
{#if error_mesg}
        <div id="errormesg" class="w-full flex justify-between mt-2 mb-4 p-2 bg-white shadow shadow-slate-500 rounded-lg">
            <div class="w-full md:mt-0 text-center p-2 text-orange-800 text-xl">{error_mesg}</div>
            <button on:click={()=>error_mesg=''} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
        </div>
{/if}    
<div class="flex justify-center items-center border-b px-4 pb-4">    
    <div class="text-slate-800 font-bold text-2xl">Provisional Form - {data?.academicYear?.name}</div>
</div>
<div class="mx-4 my-2 flex justify-around gap-2 flex-row">
    <label class="font-bold w-40" for="fname">Mobile Number<span class="text-sm text-red-500">*</span></label>
    <input on:blur={fetchProvDt} bind:value={inquiry_contact} name="first_name" class:border-orange-700={$errors.first_name} use:uppercase class="input w-full" type="text" id="fname" required/>               
    <button on:click={fetchProvDt} class="bg-blue-700 hover:bg-blue-800 text-white p-2 w-1/4 rounded">Fetch Inquiry</button>
</div>
<form class="text-sm p-2" on:submit={handleSubmit}>
    <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Admission Details</div>
    <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
        <div class="flex justify-between p-1 lg:flex-row flex-col">            
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
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="branch">Select Branch <span class="text-sm text-red-500">*</span></label>
                <select bind:value={$form.branch} class:border-orange-700={$errors.branch} class="input" type="text" name="branch" id="branch" required>
                    <option value=""></option>
                    {#if branchList}
                        {#each branchList as branch}
                            <option value={branch.id}>{branch.name}({branch.alias})</option>
                        {/each}
                    {/if}
                </select>
            </div>
            <div class="flex flex-col w-full md:w-1/2 mt-1 px-2">
                <label for='mq' class="font-bold px-1">D2D Admission</label>
                <div class="flex flex-row border border-blue-400 p-2 rounded">
                    <input type="checkbox" bind:checked={$form.is_d2d} class="border w-4 p-2" id="mq"/><label class="mx-2 font-bold" for="mq">Is D2D?</label>
                </div>
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
                <input on:blur={handleChange} bind:value={$form.first_name} name="first_name" class:border-orange-700={$errors.first_name} use:uppercase class="input" type="text" id="fname" required>               
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="mname">Midldle Name <span class="text-sm text-red-500">*</span></label>
                <input on:blur={handleChange} bind:value={$form.middle_name} name="middle_name" class:border-orange-700={$errors.middle_name} use:uppercase class="input" type="text" id="mname" required>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="lname">Last Name/Surname <span class="text-sm text-red-500">*</span></label>
                <input on:blur={handleChange} bind:value={$form.last_name} name="last_name" class:border-orange-700={$errors.last_name} use:uppercase class="input" type="text" id="lname" required>
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
                    <label class="font-bold" for="guardian_name">Full Name <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.father_name} name="father_name" class:border-orange-700={$errors.father_name} use:uppercase class="input" type="text" id="guardian_name" required>
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
            </div>
        </div>
        <div>
            <h2 class="px-2 font-bold text-xl border-t border-blue-500 mt-2 pt-2 underline">Mother Detail</h2>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_name">Full Name <span class="text-sm text-red-500">*</span></label>

                    <input on:blur={handleChange} bind:value={$form.mother_name} name="mother_name" class:border-orange-700={$errors.mother_name} use:uppercase class="input" type="text" id="guardian1_name" required>
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
            </div>

        </div>
    </div>
    {#each Object.entries($errors) as [property,error]}    
        {#if error}
            <p class="bg-orange-400 text-white w-full text-sm mx-2 my-1 p-2 border">{error}</p>
        {/if}
    {/each}
    




    
    
    <div class="flex justify-end border flex-row border-blue-400 p-4 mt-4 bg-white shadow shadow-slate-400 rounded">
        <button on:click={()=>{isDlgOpen=true}} class="w-48 button-primary" type="button">QR CODE</button>
        <button disabled={loading} type="submit" class="w-48 button-primary">
            {#if loading}
                Please Wait....
            {:else}
                Submit
            {/if}
        </button>
    </div>
</form>
{#if isDlgOpen}
    <Modal on:close={()=>{isDlgOpen=false}}>
        <div slot="header">Fee Collection</div>
        <div slot="content">
            {#if $college?.qrcode_image}
                <div class="flex flex-col justify-center text-center px-2 py-4">
                    <img class="mx-auto w-1/2" src={$college?.qrcode_image} alt="QR" width="250" height="250">

                    <p class="bg-orange-800 text-white text-xl font-bold">Please, Don't use credit card for Payment</p>
                </div>                            
            {/if}
        </div>
        <div slot="foot">
            <div class="">
                <button on:click={()=>{isDlgOpen=false}} class="px-2 py-2 bg-orange-700 text-white hover:bg-orange-500 shadow shadow-orange-400 uppercase rounded disabled:bg-gray-400 w-48">Close</button>
            </div>
        </div>    
    </Modal>
{/if}








