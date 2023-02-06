<script>
    import "../app.css"

	import Auth from '$lib/auth/login.svelte'
</script>

<div class="container mx-auto w-11/12 min-h-screen text-blue-800">
    <Auth/>
    <slot></slot>
</div>



