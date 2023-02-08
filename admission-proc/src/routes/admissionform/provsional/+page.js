/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    const college_id = url.searchParams.get('college_id')    
    const ayear_id = url.searchParams.get('ayear_id')    
    let { data:academicYear, error:ayear_err } = await supabase
        .from('AcademicYear').select('*').eq('id',ayear_id).single()
    if(ayear_err)
        return {error:ayear_err}
    let { data:college, error } = await supabase
        .from('College').select('*').eq('id',college_id).single()

    if(error)
        return {error}
    let { data:dt, error:err1 } = await supabase
        .from('Course').select('*').eq('college_id',college_id)

    if(err1)
        return {error:err1}
    const courselist=dt    
    return {    
        academicYear,
        college,
        courselist
    };      
}


