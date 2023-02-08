<script>
    import supabase from '$lib/db'

    let email,password
    let mesg='',loading=false

    const handleLogin=async()=>{
        try{
                loading = true
                const { error } = await supabase.auth.signInWithPassword({ email,password })
                if (error) {
                    if(error instanceof Error)

                        mesg=error.message
                }                
                else{
                    mesg=''
                }        
        } catch (error) {
            if (error instanceof Error) {
                mesg=error.message
            }
        } finally {
            loading = false
        }
    }
</script>
<div class="m-2 px-2">
    <div class="font-bold  text-lg flex items-center bg-blue-500 rounded shadow shadow-slate-500 text-white py-2 text-center">

        <img class="ml-2 shadow rounded w-24" src="../logo.png" alt="logo">
        <div class="w-full text-center">
            <h1 class="lg:text-2xl text-xl">Sardar Vallbhbhai Patel Institute of Technlogy,Vasad.</h1>
            <h2 class="text-xl font-bold">Provisional Admission Form</h2>
        </div>
    </div>



    <form class="mx-auto mt-4 flex text-center" on:submit={handleLogin}>
        <input bind:value={email} type="email" required placeholder="Email">
        <input bind:value={password} type="password" required placeholder="Password">
        <button>Login</button>
    </form>
</div>