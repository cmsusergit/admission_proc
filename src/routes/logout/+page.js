import {supabase} from '$lib/db'
import {redirect} from '@sveltejs/kit'

export async function load() {
    try{
        const { error } = await supabase.auth.signOut()
            if (error) {
                if(error instanceof Error)
                    console.log(error.message)
            }                
            throw redirect(302,'/')
        } catch (error) {

            if (error instanceof Error) {                
                console.log(error.message)
            }
        }
}



