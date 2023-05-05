/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    const id = url.searchParams.get('id')

    let { data:profile, error:dt_err } = await supabase
    .from('ProvFormInfo')
    .select(`*,Course!inner(*),Branch(name,alias)`)
    .filter('id','eq',id).single()
    if(dt_err)
        return {error:dt_err.message}

    return {    
        profile
    }
}


