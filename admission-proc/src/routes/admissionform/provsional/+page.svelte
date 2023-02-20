<script>
    import { mesg,college } from '$lib/store.js'
    
    import {supabase} from "$lib/db"
    import { goto } from '$app/navigation'
    import { onMount } from 'svelte';
    import {createForm} from 'svelte-forms-lib'
    import * as yup from 'yup'
    export let data
    let branchList=[],sameAddrSelected=false



    const {form,errors,handleChange,handleSubmit}=createForm({
        initialValues:{title:'Mr.',per_country:'INDIA'},
        validationSchema:yup.object().shape({
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
        }),
        onSubmit:value=>{
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
        $form.academic_year=data.academicYear.id
    })


    const insertRecord=async(provFormInfo)=>{
        try{
            loading = true
            const { data, error } = await supabase
            .from('ProvFormInfo')
            .insert([           
                provFormInfo
            ])
            if(error)
            {
                if(error instanceof Error){
                    error_mesg=error.message
                    $mesg=''
                }
            }
            else{
                error_mesg=''
                $mesg='Form Record Inserted Successully.'
                goto('/')
            }            
        } catch (error) {
            if (error instanceof Error) {
                $mesg=''
                error_mesg=error.message
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
<div class="flex justify-between items-center border-b px-4 pb-4">
    <a href="/" class="block text-slate-800 font-bold text-2xl">
        <div class="flex flex-row items-center justify-center space-x-2">
            <svg class="text-slate-800 w-8" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 219.151 219.151" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M109.576,219.151c60.419,0,109.573-49.156,109.573-109.576C219.149,49.156,169.995,0,109.576,0S0.002,49.156,0.002,109.575 C0.002,169.995,49.157,219.151,109.576,219.151z M109.576,15c52.148,0,94.573,42.426,94.574,94.575 c0,52.149-42.425,94.575-94.574,94.576c-52.148-0.001-94.573-42.427-94.573-94.577C15.003,57.427,57.428,15,109.576,15z"></path> <path d="M94.861,156.507c2.929,2.928,7.678,2.927,10.606,0c2.93-2.93,2.93-7.678-0.001-10.608l-28.82-28.819l83.457-0.008 c4.142-0.001,7.499-3.358,7.499-7.502c-0.001-4.142-3.358-7.498-7.5-7.498l-83.46,0.008l28.827-28.825 c2.929-2.929,2.929-7.679,0-10.607c-1.465-1.464-3.384-2.197-5.304-2.197c-1.919,0-3.838,0.733-5.303,2.196l-41.629,41.628 c-1.407,1.406-2.197,3.313-2.197,5.303c0.001,1.99,0.791,3.896,2.198,5.305L94.861,156.507z"></path> </g> </g></svg>
            <span class="uppercase text-slate-800 hover:text-slate-500 hover:underline text-xl"></span>
        </div>
    </a>
    <div class="text-slate-800 font-bold text-2xl">Provisional Form - {data?.academicYear?.name}</div>
</div>
{#if error_mesg}                
    <div class="md:mt-0 sm:max-w-md py-4 m-4 w-full p-4 text-center text-orange-800 text-xl bg-white shadow shadow-slate-500 rounded-lg">{error_mesg}</div>
{/if}
<form class="px-2 py-2" on:submit={handleSubmit}>
    <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Admission Details</div>
    <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
        <div class="flex justify-between p-1 lg:flex-row flex-col">            
            <div class="flex flex-col w-full m-1">
                <label for="course" class="font-bold">Select Course <span class="text-sm text-red-500">*</span></label>
                <select bind:value={$form.course} class:border-orange-700={$errors.course} class="border rounded px-1 py-2 border-blue-400" type="text" name="course" id="course" required>
                    {#if data?.courselist}
                        {#each data?.courselist as course}
                            <option value={course.id}>{course.name}({course.alias})</option>
                        {/each}
                    {/if}
                </select> 
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="branch">Select Branch <span class="text-sm text-red-500">*</span></label>
                <select bind:value={$form.branch} class:border-orange-700={$errors.branch} class="border rounded px-1 py-2 border-blue-400" type="text" name="branch" id="branch" required>
                    <option value=""></option>
                    {#if branchList}
                        {#each branchList as branch}
                            <option value={branch.id}>{branch.name}({branch.alias})</option>
                        {/each}
                    {/if}
                </select>
            </div>
        </div>               
    </div>
    <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-800 rounded-t-lg md:w-1/4">Personal Details</div>
    <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400">
        <div class="flex justify-between p-1 lg:flex-row flex-col">
            <div class="flex m-1 flex-col w-48">
                <label class="font-bold" for="title">Title <span class="text-sm text-red-500">*</span></label>
                <select bind:value={$form.title} name="title" class:border-orange-700={$errors.title} class="border rounded px-1 py-2 border-blue-400" type="text" id="title" required>
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mrs.</option>
                </select>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="fname">First Name <span class="text-sm text-red-500">*</span></label>
                <input on:blur={handleChange} bind:value={$form.first_name} name="first_name" class:border-orange-700={$errors.first_name} class="border rounded px-1 py-2 border-blue-400" type="text" id="fname" required>               
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="mname">Midldle Name <span class="text-sm text-red-500">*</span></label>
                <input on:blur={handleChange} bind:value={$form.middle_name} name="middle_name" class:border-orange-700={$errors.middle_name} class="border rounded px-1 py-2 border-blue-400" type="text" id="mname" required>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="lname">Last Name <span class="text-sm text-red-500">*</span></label>
                <input on:blur={handleChange} bind:value={$form.last_name} name="last_name" class:border-orange-700={$errors.last_name} class="border rounded px-1 py-2 border-blue-400" type="text" id="lname" required>
            </div>
        </div>
        <div class="flex justify-between p-1 lg:flex-row flex-col">
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="contact">Contact Number (Preferable WhatsApp) <span class="text-sm text-red-500">*</span></label>
                <input on:blur={handleChange} bind:value={$form.contact} name="contact" class:border-orange-700={$errors.contact} class="border rounded px-1 py-2 border-blue-400" type="text" id="contact" >
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="email">Email <span class="text-sm text-red-500">*</span></label>
                <input on:blur={handleChange} bind:value={$form.email} name="email" class:border-orange-700={$errors.email} class="border rounded px-1 py-2 border-blue-400" type="text" id="email" >
            </div>
        </div>
        <div class="flex justify-between p-1 lg:flex-row flex-col">                
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="dob">Birth Date <span class="text-sm text-red-500">*</span></label>               
                <input on:blur={handleChange} bind:value={$form.dob} name="dob" class:border-orange-700={$errors.dob} class="border rounded px-1 py-2 border-blue-400" type="date" id="dob" required>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="gender">Gender <span class="text-sm text-red-500">*</span></label>
                <select bind:value={$form.gender} name="gender" class:border-orange-700={$errors.gender} class="border rounded px-1 py-2 border-blue-400" type="text" id="title" required>
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
                        <input on:blur={handleChange} bind:value={$form.per_addr1} name="per_addr1" class:border-orange-700={$errors.per_addr1} class="border rounded px-1 py-2 border-blue-400" type="text" id="addr_line1" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="addr_line2">Address Line2 </label>
                        <input on:blur={handleChange} bind:value={$form.per_addr2} name="per_addr2" class="border rounded px-1 py-2 border-blue-400" type="text" id="addr_line2">
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="city">City <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.per_city} name="per_city" class:border-orange-700={$errors.per_city} class="border rounded px-1 py-2 border-blue-400" type="text" id="city" required>

                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="state">State <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.per_state} name="per_state" class:border-orange-700={$errors.per_state} class="border rounded px-1 py-2 border-blue-400" type="text" id="state" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="country">Country <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.per_country} name="per_country" class:border-orange-700={$errors.per_country} class="border rounded px-1 py-2 border-blue-400" type="text" id="country" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="zipcode">ZipCode <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.per_zipcode} name="per_zipcode" class:border-orange-700={$errors.per_zipcode} class="border rounded px-1 py-2 border-blue-400" type="text" id="zipcode" required>
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
                        <input on:blur={handleChange} bind:value={$form.present_addr1} name="present_addr1" class:border-orange-700={$errors.present_addr1} class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_Addr_line1" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_addr_line2">Address Line2 </label>
                        <input on:blur={handleChange} bind:value={$form.present_addr2} name="present_addr2" class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_addr_line2">
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_city">City <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.present_city} name="present_city" class:border-orange-700={$errors.present_city} class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_city" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_state">State <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.present_state} name="present_state" class:border-orange-700={$errors.present_state} class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_state" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_country">Country <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.present_country} name="present_country" class:border-orange-700={$errors.present_country} class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_country" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_zipcode">ZipCode <span class="text-sm text-red-500">*</span></label>
                        <input on:blur={handleChange} bind:value={$form.present_zipcode} name="present_zipcode" class:border-orange-700={$errors.present_zipcode} class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_zipcode" required>
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
                    <input on:blur={handleChange} bind:value={$form.father_name} name="father_name" class:border-orange-700={$errors.father_name} class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian_name" required>
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian_number">Contact Number (Preferable WhatsApp) <span class="text-sm text-red-500">*</span></label>
                    
                    <input on:blur={handleChange} bind:value={$form.father_contact} name="father_contact" class:border-orange-700={$errors.father_contact} class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian_number" required>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian_email">Email <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.father_email} name="father_email" class:border-orange-700={$errors.father_email} class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian_email" required>
                </div>
            </div>
        </div>
        <div>
            <h2 class="px-2 font-bold text-xl border-t border-blue-500 mt-2 pt-2 underline">Mother Detail</h2>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_name">Full Name <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.mother_name} name="mother_name" class:border-orange-700={$errors.mother_name} class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian1_name" required>
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_number">Contact Number (Preferable WhatsApp) <span class="text-sm text-red-500">*</span></label>                    
                    <input on:blur={handleChange} bind:value={$form.mother_contact} name="mother_contact" class:border-orange-700={$errors.mother_contact} class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian1_number" required>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_email">Email <span class="text-sm text-red-500">*</span></label>
                    <input on:blur={handleChange} bind:value={$form.mother_email} name="mother_email" class:border-orange-700={$errors.mother_email} class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian1_email" required>
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
        <button disabled={loading} type="submit" class="px-2 py-2 w-48 mr-2 bg-blue-700 text-white hover:bg-blue-500 shadow shadow-blue-400 rounded">
            {#if loading}
                Please Wait....
            {:else}
                Submit
            {/if}
        </button>
    </div>
</form>