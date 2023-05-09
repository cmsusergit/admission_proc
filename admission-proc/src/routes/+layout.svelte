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
    import Dashboard from './dashboard/+page.svelte'

    export let data
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
<!-- <div>{JSON.stringify($page.data?.session?.user?.user_metadata?.role)}</div>
-->
<div class="container mx-auto w-11/12 min-h-screen text-blue-800">
    {#if !$page.data.session}
        {#if $page.route.id.includes('admissionform/mqnri')}    
            <Header/>
            <slot></slot>
        {:else}
            <Auth/>
        {/if}
    {:else if !$page.data.session.user.user_metadata.role}
        {#if $page.route.id.includes('admissionform/mqnri')}    
            <Header/>
            <slot></slot>
        {:else}
            <Header/>
            <Dashboard profileDt={data}></Dashboard>
        {/if}
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
        &copy; Sardar Vallabhbhai Patel Group of Institutes,Vasad.
    </div>
</div>


