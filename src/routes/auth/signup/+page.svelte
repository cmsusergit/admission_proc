<script>
    import {supabase} from '$lib/db'

    let email,password
    let confirmPassword
    let role=""
    let mesg='',loading=false
    const handleSignUp=async()=>{
        try{
                loading = true
                
                
                
                const { data, error } = await supabase.auth.signUp(
                {                 
                    email: email,
                    password: password,
                    options: {
                    data: {
                        role: role
                    }
                    }
                }
                )
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
    <div class="mt-4 h-screen rounded">
        <section>
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">               
                {#if mesg}                
                    <div class="md:mt-0 sm:max-w-md py-4 m-4 w-full p-4 text-center text-orange-800 text-xl bg-white shadow shadow-slate-500 rounded-lg">{mesg}</div>
                {/if}
                <div>
                    <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl mb-8 text-slate-800">
                        SignUp
                    </h1>
                </div>
                <div class="flex md:flex-row flex-col justify-center w-full md:space-x-5">
                    <div class="w-full bg-gradient-to-br from-slate-500 to-slate-700 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <p class="text-white text-lg">Using Email and Password</p>
                            <form class="space-y-4 md:space-y-7" on:submit={handleSignUp}>
                                <div>
                                    <label for="email" class="block mb-2 text-sm font-medium text-white">Your email</label>
                                    <input bind:value={email} type="email" id="email" class="bg-gray-50 border border-gray-400 text-gray-900 sm:text-sm rounded-lgfocus:border-gray-200 block w-full p-2.5 placeholder-gary-200 focus:ring-blue-500 focus:border-blue-500" placeholder="Email" required>
                                </div>
                                <div>
                                    {#if password!==confirmPassword}
                                        <span class="text-orange-500 text-sm">Password Does Not Matches</span>
                                    {/if}
                                    <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
                                    <input bind:value={password} type="password" id="password" class="bg-gray-50 border border-gray-400 text-gray-900 sm:text-sm rounded-lgfocus:border-gray-200 block w-full p-2.5 placeholder-gary-200 focus:ring-blue-500 focus:border-blue-500" placeholder="Password" required>
                                </div>
                                <div>
                                    <label for="password1" class="block mb-2 text-sm font-medium text-white">Password</label>
                                    <input bind:value={confirmPassword} type="password" id="password1" class="bg-gray-50 border border-gray-400 text-gray-900 sm:text-sm rounded-lgfocus:border-gray-200 block w-full p-2.5 placeholder-gary-200 focus:ring-blue-500 focus:border-blue-500" placeholder="Confirm Password" required>
                                </div>
                                <div class="px-2 w-full">
                                    <label for="password" class="block mb-2 text-sm font-medium text-white">Role</label>
                                    <select bind:value={role} class="w-full border font-normal text-sm p-2.5 text-center rounded">
                                        {#each ["","deo","admin","trustee","-"] as temp}
                                            <option>{temp}</option>
                                        {/each}
                                    </select>
                                </div>
                                <div class="px-2 py-2">
                                    <button type="submit" class="w-full border text-slate-800 bg-white hover:text-slate-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 uppercase text-center disabled:bg-slate-400 disabled:text-white" disabled={loading || password!==confirmPassword}>
                                        {#if loading}
                                            Please Wait....
                                        {:else}
                                            SignUp
                                        {/if}
                                    </button>                      
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>