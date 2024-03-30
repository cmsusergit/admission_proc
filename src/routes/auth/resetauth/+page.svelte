<script>
    import {supabase} from "$lib/db"
    
    let password=''
    const resetPwd=async()=>{
        const { data, error } = await supabase.auth.updateUser({
            password: password
        })
        if(error){
            alert(error)
            return
        }
        alert("Password Reset")
    }
</script>

<div>
    <h1 class="text-2xl text-slate-800">Reset Password</h1>
    <form on:submit|preventDefault={resetPwd}>
        <input type="password" bind:value={password} required>
        <button type="submit">Reset</button>
    </form>
</div>




