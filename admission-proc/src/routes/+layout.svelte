<script>
    import "../app.css"

	import Auth from '$lib/auth/login.svelte'
	import Header from '$lib/header.svelte'
    import { supabase } from '$lib/db'
    import { invalidate } from '$app/navigation'
    import { page } from '$app/stores'
    import { onMount } from 'svelte'
    import {navigating} from '$app/stores'
    import Spinner from '$lib/spinner.svelte'


    onMount(() => {
        const {
        data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
        invalidate('supabase:auth')

        })
        return () => {
        subscription.unsubscribe()
        }
    })
</script>

<div class="container mx-auto w-11/12 min-h-screen text-blue-800">
    {#if !$page.data.session}
        <Auth/>
    {:else}
        {#if $navigating}
            <Spinner/>
        {/if}
        <Header/>
        <div>
            <slot></slot>
        </div>
    {/if}
    <div class="border-t-2 text-xl py-4 text-slate-800 border-slate-800 w-full font-bold text-center">
        &copy; Sardar Vallabhbhai Patel Campus,Vasad.
    </div>
</div>

