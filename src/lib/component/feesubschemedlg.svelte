<script>
    import { createEventDispatcher } from "svelte"
    
    const dispatch =createEventDispatcher()
    export let feesCategoryList,feeSchemeList
    export let courseList,academic_year    
    export let recordDt
    let feeSubSchemeRecord=recordDt?recordDt:{}
    $:feeSubSchemeRecord.academic_year=academic_year
    $:feeSubSchemeRecord=recordDt?recordDt:{}
</script>


<div class="bg-white w-full"> 
    <form class="text-sm p-2" on:submit={()=>{dispatch('submit',feeSubSchemeRecord)}}>        
        <div class="flex justify-between flex-col items-center md:space-x-2 md:flex-row p-2 rounded">
            <div class="flex flex-col w-full m-1">
                <label for="name" class="font-bold">Name<span class="text-sm text-red-500">*</span></label>    
                <input bind:value={feeSubSchemeRecord.name}  class="border rounded px-1 py-2 border-blue-400" type="text" id="name" required>
            </div>
            <div class="flex flex-col w-full m-1">
                <label for="amount" class="font-bold">Amount<span class="text-sm text-red-500">*</span></label>    
                <input bind:value={feeSubSchemeRecord.amount}  class="border rounded px-1 py-2 border-blue-400" type="text" id="amount" required>
            </div>
        </div>
        <div class="flex justify-between flex-col items-center md:space-x-2 md:flex-row p-2 rounded">
            <div class="flex flex-col w-full">      
                <label for="category" class="font-bold">Fees Category <span class="text-sm text-red-500">*</span></label>
                <select bind:value={feeSubSchemeRecord.fees_category} class="input" type="text" name="category" id="category" required>
                    {#if feesCategoryList}
                        {#each feesCategoryList as recordDt}
                            <option value={recordDt.id}>{recordDt.name}</option>
                        {/each}
                    {/if}
                </select>
            </div>
            <div class="flex flex-col w-full m-1">
                <label for="course" class="font-bold">Fees Scheme<span class="text-sm text-red-500">*</span></label>
                <select bind:value={feeSubSchemeRecord.fees_scheme} class="input" type="text" name="course" id="course" required>
                    {#if feeSchemeList}
                        {#each feeSchemeList as recordDt}
                            <option value={recordDt.id}>{recordDt.name}</option>
                        {/each}
                    {/if}
                </select> 
            </div>    
            <div class="flex flex-col w-full m-1">
                <label for="course" class="font-bold">Fees Scheme<span class="text-sm text-red-500">*</span></label>
                <select bind:value={feeSubSchemeRecord.course} class="input" type="text" name="course" id="course" required>
                    {#if courseList}
                        {#each courseList as recordDt}
                            <option value={recordDt.id}>{recordDt.name}</option>
                        {/each}
                    {/if}
                </select> 
            </div>    
        </div>

        
        
        
        
        
        
        
        
        
        <div class="flex justify-end">           
            <button type="submit" class="button-primary w-20">SUBMIT</button>
            <button on:click={()=>{dispatch('close')}} class="button-primary w-20 bg-orange-800 hover:bg-orange-700">CLOSE</button>
        </div>
    </form>
</div>
