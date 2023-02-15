<script>
    import { mesg,college } from '$lib/store.js'
    
    import {supabase} from "$lib/db"
    import { goto } from '$app/navigation'
    export let data
    let branchList=[],sameAddrSelected=false
    let provFormInfo={}
    let error_mesg='',loading=false
    $:{
        if(data){
            college.set(data.college)      
            
            provFormInfo.academic_year=data.academicYear.id
        }
    }
    const onSubmit=async()=>{
        try{
            loading = true
            console.log(provFormInfo)
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
            provFormInfo.present_addr1=provFormInfo.per_addr1
            provFormInfo.present_addr2=provFormInfo.per_addr2
            provFormInfo.present_city=provFormInfo.per_city
            provFormInfo.present_state=provFormInfo.per_state
            provFormInfo.present_country=provFormInfo.per_country
            provFormInfo.present_zipcode=provFormInfo.per_zipcode
        }        
        else{
            provFormInfo.present_addr1=''
            provFormInfo.present_addr2=''
            provFormInfo.present_city=''
            provFormInfo.present_state=''
            provFormInfo.present_country='' 
            provFormInfo.present_zipcode=''
        }
    }
    const onCourseChange=(event)=>{
        const course=event.target.value
        const temp=data.courselist.find(ob=>ob.id==course)
        branchList=temp?temp.Branch:[]
    }
</script>
<p>{JSON.stringify(provFormInfo)}</p>
<div class="flex justify-between items-center border-b px-4 pb-4">
    <a href="/" class="block text-slate-800 font-bold text-2xl">
        <div class="flex flex-row items-center justify-center space-x-2">
            <svg class="text-slate-800 w-8" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 219.151 219.151" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M109.576,219.151c60.419,0,109.573-49.156,109.573-109.576C219.149,49.156,169.995,0,109.576,0S0.002,49.156,0.002,109.575 C0.002,169.995,49.157,219.151,109.576,219.151z M109.576,15c52.148,0,94.573,42.426,94.574,94.575 c0,52.149-42.425,94.575-94.574,94.576c-52.148-0.001-94.573-42.427-94.573-94.577C15.003,57.427,57.428,15,109.576,15z"></path> <path d="M94.861,156.507c2.929,2.928,7.678,2.927,10.606,0c2.93-2.93,2.93-7.678-0.001-10.608l-28.82-28.819l83.457-0.008 c4.142-0.001,7.499-3.358,7.499-7.502c-0.001-4.142-3.358-7.498-7.5-7.498l-83.46,0.008l28.827-28.825 c2.929-2.929,2.929-7.679,0-10.607c-1.465-1.464-3.384-2.197-5.304-2.197c-1.919,0-3.838,0.733-5.303,2.196l-41.629,41.628 c-1.407,1.406-2.197,3.313-2.197,5.303c0.001,1.99,0.791,3.896,2.198,5.305L94.861,156.507z"></path> </g> </g></svg>
            <span class="uppercase text-slate-800 hover:text-slate-500 hover:underline text-xl">back</span>
        </div>
    </a>
    <div class="text-slate-800 font-bold text-2xl">Provisional Form - {data?.academicYear?.name}</div>
</div>
{#if error_mesg}                
    <div class="md:mt-0 sm:max-w-md py-4 m-4 w-full p-4 text-center text-orange-800 text-xl bg-white shadow shadow-slate-500 rounded-lg">{error_mesg}</div>
{/if}
<form class="px-2 py-2" on:submit|preventDefault={onSubmit}>
    <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Admission Details</div>
    <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
        <div class="flex justify-between p-1 lg:flex-row flex-col">            
            <div class="flex flex-col w-full m-1">
                <label for="course" class="font-bold">Select Course</label>
                <select bind:value={provFormInfo.course} on:change={onCourseChange} class="border rounded px-1 py-2 border-blue-400" type="text" name="course" id="course" required>
                   <option value=""></option>
                    {#if data?.courselist}
                        {#each data?.courselist as course}
                            <option value={course.id}>{course.name}({course.alias})</option>
                        {/each}
                    {/if}
                </select>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="branch">Select Branch</label>
                <select bind:value={provFormInfo.branch} class="border rounded px-1 py-2 border-blue-400" type="text" name="branch" id="branch" required>
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
                <label class="font-bold" for="title">Title</label>
                <select bind:value={provFormInfo.title} name="title" class="border rounded px-1 py-2 border-blue-400" type="text" id="title" required>
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mrs.</option>
                </select>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="fname">First Name</label>
                <input bind:value={provFormInfo.first_name} name="first_name" class="border rounded px-1 py-2 border-blue-400" type="text" id="fname" required>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="mname">Midldle Name</label>

                <input bind:value={provFormInfo.middle_name} name="middle_name" class="border rounded px-1 py-2 border-blue-400" type="text" id="mname" required>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="lname">Last Name</label>
                <input bind:value={provFormInfo.last_name} name="last_name" class="border rounded px-1 py-2 border-blue-400" type="text" id="lname" required>
            </div>
        </div>
        <div class="flex justify-between p-1 lg:flex-row flex-col">
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="contact">Contact Number (Preferable WhatsApp)</label>
                <input bind:value={provFormInfo.contact} name="contact" class="border rounded px-1 py-2 border-blue-400" type="text" id="contact" required>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="email">Email</label>
                <input bind:value={provFormInfo.email} name="email" class="border rounded px-1 py-2 border-blue-400" type="text" id="email" required>
            </div>
        </div>
        <div class="flex justify-between p-1 lg:flex-row flex-col">                
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="dob">Birth Date</label>
                <input bind:value={provFormInfo.dob} name="dob" class="border rounded px-1 py-2 border-blue-400" type="date" id="dob" required>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="gender">Gender</label>
                <select bind:value={provFormInfo.gender} name="gender" class="border rounded px-1 py-2 border-blue-400" type="text" id="title" required>
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
                        <label class="font-bold" for="addr_line1">Address Line1</label>
                        <input bind:value={provFormInfo.per_addr1} name="per_addr1" class="border rounded px-1 py-2 border-blue-400" type="text" id="addr_line1" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="addr_line2">Address Line2</label>
                        <input bind:value={provFormInfo.per_addr2} name="per_addr2" class="border rounded px-1 py-2 border-blue-400" type="text" id="addr_line2">
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="city">City</label>
                        <input bind:value={provFormInfo.per_city} name="per_city" class="border rounded px-1 py-2 border-blue-400" type="text" id="city" required>

                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="state">State</label>
                        <input bind:value={provFormInfo.per_state} name="per_state" class="border rounded px-1 py-2 border-blue-400" type="text" id="state" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="country">Country</label>
                        <input bind:value={provFormInfo.per_country} name="per_country" class="border rounded px-1 py-2 border-blue-400" type="text" id="country" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="zipcode">ZipCode</label>
                        <input bind:value={provFormInfo.per_zipcode} name="per_zipcode" class="border rounded px-1 py-2 border-blue-400" type="text" id="zipcode" required>
                    </div>
                </div>
            </div>
            <div class="border-t border-b px-2 mt-2 bg-gray-100 border-blue-500 py-2">                
                <input bind:checked={sameAddrSelected} on:change={onSameAddrChanged} type="checkbox" class="border w-4 p-2" id="sameaddr"><label class="mx-2 font-bold" for="sameaddr">Same as Above</label>
            </div>
            <div>
                <h2 class="px-2 mt-2 font-bold text-xl underline">Present Address</h2>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_addr_line1">Address Line1</label>
                        <input bind:value={provFormInfo.present_addr1} name="present_addr1" class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_Addr_line1" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_addr_line2">Address Line2</label>
                        <input bind:value={provFormInfo.present_addr2} name="present_addr2" class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_addr_line2">
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_city">City</label>
                        <input bind:value={provFormInfo.present_city} name="present_city" class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_city" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_state">State</label>
                        <input bind:value={provFormInfo.present_state} name="present_state" class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_state" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_country">Country</label>
                        <input bind:value={provFormInfo.present_country} name="present_country" class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_country" required>
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_zipcode">ZipCode</label>
                        <input bind:value={provFormInfo.present_zipcode} name="present_zipcode" class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_zipcode" required>
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
                    <label class="font-bold" for="guardian_name">Full Name</label>
                    <input bind:value={provFormInfo.father_name} name="father_name" class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian_name" required>
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian_number">Contact Number (Preferable WhatsApp)</label>
                    
                    <input bind:value={provFormInfo.father_contact} name="father_contact" class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian_number" required>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian_email">Email</label>
                    <input bind:value={provFormInfo.father_email} name="father_email" class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian_email">
                </div>
            </div>
        </div>
        <div>
            <h2 class="px-2 font-bold text-xl border-t border-blue-500 mt-2 pt-2 underline">Mother Detail</h2>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_name">Full Name</label>
                    <input bind:value={provFormInfo.mother_name} name="mother_name" class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian1_name" required>
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_number">Contact Number (Preferable WhatsApp)</label>
                    
                    <input bind:value={provFormInfo.mother_contact} name="mother_contact" class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian1_number" required>
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_email">Email</label>
                    <input bind:value={provFormInfo.mother_email} name="mother_email" class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian1_email">
                </div>
            </div>
        </div>
    </div>
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