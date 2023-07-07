<script>
    import {supabase} from '$lib/db.js'

    import Modal from '$lib/modal.svelte'
    import _ from 'lodash'
    export let meritRecord
    import { createEventDispatcher, onMount } from 'svelte'
    const dispatch= createEventDispatcher()
    $:calculateTotalMerit(meritRecord)
    onMount(async()=>{        
    })    
    const calculateTotalMerit=(record)=>{
        if(record)

            meritRecord.total_merit=(meritRecord.pcm_percentile/2.0)+(meritRecord.gujcet_percentile/2.0)
    }
    const onsubmit=async()=>{
        const temp1=_.pick(meritRecord,['acpc_meritnumber','pcm_percentile','gujcet_percentile','total_merit'])
        const { data, error } = await supabase
        .from('MQNRIFormInfo')
        .update(temp1)
        .eq('id', meritRecord.id)
        if(error){
            alert(error.message)
            return
        }
        alert('Record Updated')
        dispatch('close')
    
    
    
    
    
    
    
    
    
    
    
    }
</script>
<Modal on:close={()=>{dispatch('close')}}>
    <div slot="header">Merit Information</div>
    <div slot="content">  
        
        
        
        
        
        <p class="bg-slate-400 px-2 py-2 text-center text-white mb-2 text-lg font-bold">ACPC Number: {meritRecord.acpcnumber}</p>
        <p class="bg-slate-400 px-2 py-2 text-center text-white mb-2 text-lg font-bold">{meritRecord.title??''} {meritRecord.first_name??''} {meritRecord.middle_name??''} {meritRecord.last_name??''}</p>
        <p class="bg-slate-400 px-2 py-2 text-center text-white mb-2 text-lg font-bold">Board Name: {meritRecord.board_name}</p>
        <div class="flex flex-col">
            <label class="font-bold text-sm" for="acpc_meritnumber">ACPC Merit Number</label>
            <input type="number" step="1" class="input" min="0" bind:value={meritRecord.acpc_meritnumber} name="acpc_meritnumber">
        </div>        
        <div class="flex flex-col">
            <label class="font-bold text-sm" for="pcm_percentile">PCM Percentile</label>
            <input type="number" step="0.1" class="input" min="0" bind:value={meritRecord.pcm_percentile} name="pcm_percentile">
        </div>
        
        <div class="flex flex-col">
            <label class="font-bold text-sm" for="gujcet_percentile">GUJCET Percentile</label>
            <input type="number" step="0.1" class="input" min="0" bind:value={meritRecord.gujcet_percentile} name="gujcet_percentile">
        </div>        
        <div class="flex flex-col">
            <label class="font-bold text-sm" for="total_merit">Total merit</label>
            <input disabled type="number" step="0.1" class="input bg-gray-100" min="0" bind:value={meritRecord.total_merit} name="total_merit">
        </div>        
    </div>
    <div slot="foot">
        <div class="">
            <button type="button" on:click={onsubmit} class="px-2 py-2 bg-blue-500 text-white hover:bg-blue-400 shadow shadow-blue-400 rounded disabled:bg-gray-400 uppercase w-48">submit</button>
            <button type="button" on:click={()=>{dispatch('close')}} class="px-2 py-2 bg-orange-700 text-white hover:bg-orange-500 shadow shadow-orange-400 uppercase rounded disabled:bg-gray-400 w-48">Close</button>
        </div>
    </div>
</Modal> 
