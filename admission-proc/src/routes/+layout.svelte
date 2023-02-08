<script>
    import "../app.css"

	import Auth from '$lib/auth/login.svelte'
    import { supabase } from '$lib/db'
    import { invalidate } from '$app/navigation'
    import { page } from '$app/stores'
    import { onMount } from 'svelte'
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
    <slot></slot>
    {/if}
</div>
