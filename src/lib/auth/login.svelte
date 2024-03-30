<script> 
    import {supabase} from '$lib/db'

    import {goto}  from '$app/navigation'
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
                    goto('/')
                }   
        } catch (error) {
            if (error instanceof Error) {
                mesg=error.message
            }
        } finally {
            loading = false
        }
    }
    const resetPwd=async()=>{
        console.log(email);
        const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    }
    // const handleLoginUsingEmail=async()=>{
    //     try{
    //             loading = true                
    //             const { error } = await supabase.auth.signInWithOtp({ email,password })
    //             if (error) {
    //                 if(error instanceof Error)
    //                     mesg=error.message

    //             }                
    //             else{
    //                 mesg='Please, Check Your Email To Sign In to Application'
    //             }        
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             mesg=error.message
    //         }
    //     } finally {
    //         loading = false
    //     }
    // }
</script>
<div class="m-2 px-2">
    <div class="font-bold  text-lg flex items-center text-slate-800 pt-2 pb-4 text-center border-slate-800 border-b-2">
        <img class="ml-2 w-24" src="../logo.png" alt="logo">
        <div class="w-full text-center">
            <h1 class="lg:text-4xl text-xl">Sardar Vallbhbhai Patel Group of Institutes,Vasad.</h1>
        </div>
    </div>
    <div class="mt-4 h-screen rounded">
        <section>
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">               
                {#if mesg}                
                    <div class="md:mt-0 sm:max-w-md py-4 m-4 w-full p-4 text-center text-orange-800 text-xl bg-white shadow shadow-slate-500 rounded-lg">{mesg}</div>
                {/if}
                <div>
                    <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl mb-8 text-slate-800">
                        Sign in to your account
                    </h1>
                </div>
                <div class="flex md:flex-row flex-col justify-center w-full md:space-x-5">
                    <div class="w-full bg-gradient-to-br from-slate-500 to-slate-700 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <p class="text-white text-lg">Using Email and Password</p>
                            <form class="space-y-4 md:space-y-7" on:submit={handleLogin}>
                                <div>
                                    <label for="email" class="block mb-2 text-sm font-medium text-white">Your email</label>
                                    <input bind:value={email} type="email" id="email" class="bg-gray-50 border border-gray-400 text-gray-900 sm:text-sm rounded-lgfocus:border-gray-200 block w-full p-2.5 placeholder-gary-200 focus:ring-blue-500 focus:border-blue-500" placeholder="Email" required>
                                </div>
                                <div>
                                    <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
                                    <input bind:value={password} type="password" id="password" class="bg-gray-50 border border-gray-400 text-gray-900 sm:text-sm rounded-lgfocus:border-gray-200 block w-full p-2.5 placeholder-gary-200 focus:ring-blue-500 focus:border-blue-500" placeholder="Password" required>
                                </div>
                                <div class="flex items-center justify-between">
                                    <button type='button' on:click={resetPwd} class="text-sm font-medium text-white hover:underline">Forgot password?</button>
                                </div>
                                <button type="submit" class="w-full border text-slate-800 bg-white hover:text-slate-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 uppercase text-center disabled:bg-slate-400 disabled:text-white" disabled={loading}>
                                    {#if loading}
                                        Please Wait....
                                    {:else}
                                        Login
                                    {/if}
                                </button>                      
                            </form>

                        </div>
                    </div>
                    <!-- <div class="flex justify-center items-center p-2 font-bold text-center text-lg">OR</div>
                    <div class="w-full bg-gradient-to-br from-slate-700 to-slate-500 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <p class="text-white text-lg">Using Email Only</p>
                            <form class="space-y-4 md:space-y-7" on:submit={handleLoginUsingEmail}>
                                <div>
                                    <label for="email" class="block mb-2 text-sm font-medium text-white">Your email</label>
                                    <input bind:value={email} type="email"  id="email1" class="bg-gray-50 border border-gray-400 text-gray-900 sm:text-sm rounded-lgfocus:border-gray-200 block w-full p-2.5 placeholder-gary-200 focus:ring-blue-500 focus:border-blue-500" placeholder="Email" required>
                                </div>
                                <button type="submit" class="w-full border text-slate-800 bg-white hover:text-slate-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 uppercase text-center disabled:bg-slate-400 disabled:text-white" disabled={loading}>
                                    {#if loading}
                                        Please Wait....
                                    {:else}
                                        Login
                                    {/if}

                                </button>                      
                            </form>
                        </div>
                    </div> -->
                </div>
            </div>
        </section>
    </div>
</div>
