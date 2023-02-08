/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db';

export async function load({ params,url }) {
    const college_id = url.searchParams.get('college_id');    
    let { data, error } = await supabase
          .from('College').select('*').eq('id',college_id).single()
    if(error)
          return {error}
    const college=data
    let { data:dt, error:err1 } = await supabase
          .from('Course').select('*').eq('college_id',college_id)

    if(err1)
        return {error:err1}
    const courselist=dt    
    return {    
        college,
        courselist
    };      
}


