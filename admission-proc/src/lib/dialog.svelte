<script>
    import { createEventDispatcher } from "svelte"

    const dispatch =createEventDispatcher() 
</script>

<div id="basicModal">  
    <button class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            aria-controls="basic-modal"
    >Open Basic Modal</button>
    <div class="relative z-10">


        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                    <div class="w-full bg-gray-100 text-lg font-bold p-2 text-slate-800">
                        <slot name="header"></slot>
                    </div>
                    <div class="h-full w-full p-2 text-slate-800 text-lg text-center">
                        <slot name="content"></slot>
                    </div>
    
                    
                    
                    <div class="w-full bg-gray-100 p-2 text-slate-800 flex justify-end space-x-4">
                        <slot name="confirm">
                            <button on:click={dispatch('onConfirm')} class="w-24 px-2 py-1 text-white bg-emerald-500 hover:bg-emerald-400 rounded">Confirm</button>                        
                        </slot>
                        <slot name="close">
                            <button on:click={dispatch('onCloase')} class="w-24 px-2 py-1 text-white bg-red-500 hover:bg-red-400 rounded">Close</button>
                        </slot> 
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>