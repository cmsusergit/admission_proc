<script>
	import { college } from '$lib/store.js';

	import Menu  from '$lib/menu.svelte';
</script>

<div class="font-bold m-2 px-2 text-lg flex items-center text-slate-800 pt-2 pb-4 border-b-2 border-slate-800 text-center">
    <a href="/"><img class="w-24 rounded" src="../logo.png" alt="logo"></a>
    <div class="w-full text-center">
        {#if $college && $college.name}        
            <h1 class="lg:text-4xl text-xl">{$college.name}</h1>


        {:else}
            <h1 class="lg:text-4xl text-xl">Sardar Vallbhbhai Patel Institute,Vasad.</h1>
        {/if}
    </div>
</div>

<Menu/>




