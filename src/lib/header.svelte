<script>
	import { college } from '$lib/store.js';

	import Menu  from '$lib/menu.svelte';
</script>

<div class="font-bold m-2 px-2 text-lg flex items-center text-slate-800 pt-2 pb-4 border-b-2 border-slate-800 text-center">
    {#if $college?.logo}
        <a href="/"><img class="w-24 rounded" src='{$college.logo}' alt="logo"></a>
    {:else}
        <a href="/"><img class="w-24 rounded" src="../logo.png" alt="logo"></a>
    {/if}

    <div class="w-full text-center">
        {#if $college && $college.name}       
            <h1 class="lg:text-4xl text-xl">{$college.name}</h1>
            <p class="mt-2 text-slate-800 font-bold text-xl">For Any Query, Please Contact Help Line Number (9510782983/84)</p>
            <p class="mt-2 text-slate-800 font-bold text-xl">Or Email us at admission@svitvasad.ac.in</p>

        {:else}
            <h1 class="lg:text-4xl text-xl">Sardar Vallbhbhai Patel Group of Institutes,Vasad.</h1>
        {/if}
    </div>
</div>
<Menu/>



