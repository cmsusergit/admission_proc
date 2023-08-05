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

    import DeoDashboard from '$lib/component/deo_dashboard.svelte'
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
            <Dashboard profileEmail={data?.session?.user?.email}></Dashboard>
        {/if}
    {:else}
        {#if $navigating}
            <Spinner/>
        {/if}
        <Header/>
        <div>
            {#if $page.data.session.user.user_metadata.role=='deo'}
                {#if $page.route.id.includes('admissionform/acpc') ||$page.route.id.includes('admissionform/vacant') || $page.route.id.includes('admissionform/mqnri')}    
                    <slot></slot>
                {:else}
                    <DeoDashboard></DeoDashboard>
                {/if}
            {:else}
                <slot></slot>
            {/if}
        </div>
    {/if}
    <div class="border-t-2 text-xl py-4 text-slate-800 border-slate-800 w-full font-bold text-center">
        &copy; Sardar Vallabhbhai Patel Group of Institutes,Vasad.
    </div>
</div>




















