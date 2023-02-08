<script>
    export let data

</script>
<div class="font-bold m-2 px-2 text-lg flex items-center bg-blue-500 rounded shadow-lg shadow-slate-500 text-white py-2 text-center">
    <img class="w-24 rounded" src="../logo.png" alt="logo">
    <div class="w-full text-center">
        <h1 class="lg:text-2xl text-xl">{data?.college?.name}</h1>
        <h2 class="text-xl font-bold">Provisional Admission Form</h2>
    </div>
</div>
<form class="px-2 py-2">
    <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-500 rounded-t-lg md:w-1/4">Admission Details</div>            
    <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400 rounded">
        <div class="flex justify-between p-1 lg:flex-row flex-col">
            <div class="flex flex-col w-full m-1">
                <label for="course" class="font-bold">Select Course</label>
                <select class="border rounded px-1 py-2 border-blue-400" type="text" id="course">
                    <option value=""></option>
                    {#each data.courselist as course}
                        <option value={course.id}>{course.name}({course.alias})</option>
                    {/each}
                </select>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="branch">Select Branch</label>
                <select class="border rounded px-1 py-2 border-blue-400" type="text" id="branch">
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                </select>
            </div>
        </div>               
    </div>
    <div class="font-bold bg-blue-500 px-2 text-white text-lg mt-2 py-2 shadow-lg shadow-slate-800 rounded-t-lg md:w-1/4">Personal Details</div>
    <div class="flex justify-between border flex-col border-blue-400 p-2 bg-white shadow shadow-slate-400">
        <div class="flex justify-between p-1 lg:flex-row flex-col">
            <div class="flex m-1 flex-col w-48">
                <label class="font-bold" for="title">Title</label>
                <select class="border rounded px-1 py-2 border-blue-400" type="text" id="title">
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                </select>
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="fname">First Name</label>
                <input class="border rounded px-1 py-2 border-blue-400" type="text" id="fname">
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="mname">Midldle Name</label>
                <input class="border rounded px-1 py-2 border-blue-400" type="text" id="mname">
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="lname">Last Name</label>
                <input class="border rounded px-1 py-2 border-blue-400" type="text" id="lname">
            </div>
        </div>
        <div class="flex justify-between p-1 lg:flex-row flex-col">
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="contact">Contact Number (Preferable WhatsApp)</label>

                <input class="border rounded px-1 py-2 border-blue-400" type="text" id="contact">
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="email">Email</label>
                <input class="border rounded px-1 py-2 border-blue-400" type="text" id="email">
            </div>
        </div>
        <div class="flex justify-between p-1 lg:flex-row flex-col">                
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="dob">Birth Date</label>
                <input class="border rounded px-1 py-2 border-blue-400" type="date" id="dob">
            </div>
            <div class="flex flex-col w-full m-1">
                <label class="font-bold" for="gender">Gender</label>
                <input class="border rounded px-1 py-2 border-blue-400" type="text" id="gender">
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
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="addr_line1">
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="addr_line2">Address Line2</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="addr_line2">
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="city">City</label>

                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="city">
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="state">State</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="state">
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="country">Country</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="country">
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="zipcode">ZipCode</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="zipcode">
                    </div>
                </div>
            </div>
            <div class="border-t border-b px-2 mt-2 bg-gray-100 border-blue-500 py-2">                
                <input type="checkbox" class="border w-4 p-2" id="sameaddr"><label class="mx-2 font-bold" for="sameaddr">Same as Above</label>
            </div>
            <div>
                <h2 class="px-2 mt-2 font-bold text-xl underline">Present Address</h2>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_addr_line1">Address Line1</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_Addr_line1">
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_addr_line2">Address Line2</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_addr_line2">
                    </div>
                </div>
                <div class="flex justify-between p-1 lg:flex-row flex-col">
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_city">City</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_city">
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_state">State</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_state">
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_country">Country</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_country">
                    </div>
                    <div class="flex flex-col w-full m-1">
                        <label class="font-bold" for="pre_zipcode">ZipCode</label>
                        <input class="border rounded px-1 py-2 border-blue-400" type="text" id="pre_zipcode">
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
                    <input class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian_name">
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian_number">Contact Number (Preferable WhatsApp)</label>
                    <input class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian_number">
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian_email">Email</label>
                    <input class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian_email">
                </div>
            </div>
        </div>
        <div>
            <h2 class="px-2 font-bold text-xl border-t border-blue-500 mt-2 pt-2 underline">Mother Detail</h2>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_name">Full Name</label>
                    <input class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian1_name">
                </div>
            </div>
            <div class="flex justify-between p-1 lg:flex-row flex-col">
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_number">Contact Number (Preferable WhatsApp)</label>
                    <input class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian1_number">
                </div>
                <div class="flex flex-col w-full m-1">
                    <label class="font-bold" for="guardian1_email">Email</label>
                    <input class="border rounded px-1 py-2 border-blue-400" type="text" id="guardian1_email">
                </div>
            </div>
        </div>
    </div>






    
    
    
    
    
    
    <div class="flex justify-end border flex-row border-blue-400 p-4 mt-4 bg-white shadow shadow-slate-400 rounded">
        <button class="px-2 py-2 w-48 mr-2 bg-blue-700 text-white hover:bg-blue-500 shadow shadow-blue-400 rounded">Submit</button>
        <button class="px-2 py-2 w-48 bg-slate-800 text-white hover:bg-slate-500 shadow shadow-blue-400 rounded">Close</button>
    </div>
</form>
   

