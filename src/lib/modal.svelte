<script>
    import { createEventDispatcher } from "svelte"

    const dispatch =createEventDispatcher()
</script>

<div id="basicModal"> 
    <div class="relative z-10">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                <div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">

                    <div class="flex justify-between w-full bg-gray-100 text-lg font-bold p-2 text-slate-800">
                        <slot name="header"></slot>
                        <div>
                            <button on:click={()=>dispatch('close')} class="bg-gray-200 p-2 w-12 hover:bg-gray-400 hover:text-white rounded-full">X</button>
                        </div>
                    </div>
                    <div class="w-full p-2 text-slate-800">
                        <slot name="content"></slot>
                    </div>
                    <div class="w-full bg-gray-100 p-2 text-slate-800 flex justify-end space-x-4">
                        <slot name='foot'></slot>
                    </div>

                </div>











            </div>
        </div>
    </div>
</div>

