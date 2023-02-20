<script>
    export let data
    
</script>
<div class="text-xl text-slate-800">
    <table class="overflow-auto w-full">
        <thead class="border-b border-slate-800">
            <tr>                
                <th class="border border-slate-400 w-fit px-1 text-center py-2">Sr.</th>                
                <th class="border border-slate-400 text-center w-5/12 py-2">Name</th>
                <th class="border border-slate-400 w-fit px-1 text-center py-2">Contact</th>
                <th class="border border-slate-400 text-center py-2">Email</th>
                <th class="border border-slate-400 text-center py-2"></th>

            </tr>
        </thead>

        
        {#each data as record,indx}
            <tr class="border-b border-slate-800">
                <td class="border border-slate-400 text-center py-2">{indx+1}</td>
                <td class="border border-slate-400 text-center py-2">
                    {record.title?record.title:''} {record.first_name?record.first_name:''} {record.middle_name?record.middle_name:''} {record.last_name?record.last_name:''}
                </td>
                <td class="border border-slate-400 text-center py-2">{record.contact}</td>
                <td class="border border-slate-400 text-center py-2">{record.email}</td>
                <td class="border border-slate-400 text-center py-2">
                    <div class="flex justify-center space-x-2 items-center">
                        <button class="border-b-2 hover:border-amber-700 text-amber-700 px-1">Edit</button>
                        <button class="border-b-2 hover:border-orange-700 text-orange-700 px-1">Remove</button>
                    </div>
                </td>
            </tr>
        {/each}  
        
        


    
    </table>
</div>
