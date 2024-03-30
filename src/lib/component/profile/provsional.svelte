<script>
    export let profile

</script>
<div>
        <div class="bg-white w-full shadow overflow-auto sm:rounded-lg">
    
            <div class="">
                <h2 class="border text-2xl px-4 py-2 bg-slate-500 font-medium text-white">User Profile - {profile.id}</h2>
            </div>
        </div>


        <div class="text-gray-800 w-full shadow sm:rounded-lg">
            <div class="bg-white border rounded my-2 text-gray-800">
                <table class="border-slate-500 border w-full p-2">                        
                    <tr class="border-slate-500 bg-slate-500 text-white border-b w-full px-2 py-2">
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Admission Details</td>
                        <td></td>
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Course</td>
                        <td class="text-lg px-2 py-2">
                            {profile?.Course?.name}
                        </td>
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Branch</td>
                        <td class="text-lg px-2 py-2">
                            {profile?.Branch?.name}
                        </td>
                    </tr>
                </table>
            </div>
            <div class="bg-white border rounded my-2 text-gray-800">
                <table class="border-slate-500 border w-full p-2">                        
                    <tr class="border-slate-500 bg-slate-500 text-white border-b w-full px-2 py-2">
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Personal Details</td>
                        <td></td>
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Name</td>
                        <td class="text-lg px-2 py-2">
                            {profile?.title} {profile?.first_name} {profile?.middle_name} {profile?.last_name}
                        </td>
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Contact</td>
                        <td class="text-lg px-2 py-2">
                            {profile?.contact}
                        </td>
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">                            
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Email</td>
                        <td class="text-lg px-2 py-2">
                            {profile?.email}
                        </td>
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">            
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">DOB</td>
                        <td class=" w-1/4 text-lg px-2 py-2">
                            {new Date(profile?.dob).toLocaleDateString()}
                        </td>
                        
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">            
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Gender</td>
                        <td class="w-1/4 text-lg px-2 py-2">{profile?.gender}</td>
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">            
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Present Address</td>
                        <td class=" w-full text-lg px-2 py-2">
                            {profile?.present_addr1} {profile.present_addr2?`,${profile.present_addr2}`:''} <br>
                            {profile?.present_city}, {profile?.present_state} <br>

                            {profile?.present_country} - {profile?.present_zipcode}
                        </td>                           
                    </tr>
                    <tr class="border-slate-500 mb-2 w-full px-2 py-2">            
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Permanent Address</td>
                        <td class=" w-full text-lg px-2 py-2">
                            {profile?.per_addr1} {profile.per_addr2?`,${profile.per_addr2}`:''} <br>
                            {profile?.per_city}, {profile?.per_state} <br>                               
                            
                            {profile?.per_country} - {profile?.per_zipcode}
                        </td>                           
                    </tr>
                </table>
            </div>
            <div class="w-full bg-white border rounded my-2 text-gray-800">
                <table class="border-slate-500 border w-full p-2">
                    <tr class="bg-slate-500 text-white border-b w-full px-2 py-2">
                        <td class="w-1/4 text-lg px-2 py-2 font-bold">Guardian Details</td>
                        <td></td>
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">
                        <td class="text-lg w-1/4 px-2 py-2 font-bold">Mother Name</td>
                        <td class="w-full text-lg px-2 py-2">
                            {profile?.mother_name}
                        </td>
                    </tr>
                    <tr class="border-slate-500 border-b w-full px-2 py-2">
                        <td class="text-lg w-1/4 px-2 py-2 font-bold">Mother Contact</td>
                        <td class="w-full text-lg px-2 py-2">
                            {profile?.mother_contact} {profile?.mother_email?`(${profile?.mother_email})`:''}
                        </td>
                    </tr> 
                    <tr class="border-slate-500 border-b w-full px-2 py-2">
                        <td class="text-lg w-1/4 px-2 py-2 font-bold">Father Name</td>
                        <td class="w-full text-lg px-2 py-2">
                            {profile?.father_name}
                        </td>
                    </tr>
                    <tr class="border-slate-500 mb-2 w-full px-2 py-2">
                        <td class="text-lg w-1/4 px-2 py-2 font-bold">Father Contact</td>
                        <td class="w-full text-lg px-2 py-2">
                            {profile?.father_contact} {profile?.father_email?`(${profile?.father_email})`:''}
                        </td>
                    </tr>                        
                </table>
            </div>
            <div class="mb-4 font-bold"></div>
        </div></div>