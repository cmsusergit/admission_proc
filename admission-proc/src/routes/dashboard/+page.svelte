<script>
    import { onMount } from "svelte";

    export let profileDt
  
</script>
<div class="text-indigo-500 min-h-screen p-2 border">
    <h1 class="font-bold text-xl">Hello Dashboard</h1>
        <p>{JSON.stringify(profileDt?.session?.user?.email)}</p>
</div>

