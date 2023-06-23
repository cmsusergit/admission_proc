/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    const college_id = url.searchParams.get('college_id')
    const ayear_id = url.searchParams.get('ayear_id') 
    let { data:college, error } = await supabase
        .from('College').select('*').eq('id',college_id).single()
    if(error)
        if(error instanceof Error)        
        return {error:error.message}


    let { data:dataTable, error:dt_err } = await supabase 
    .from('ProvFormInfo')
    .select(`*,Course!inner(*),Branch(name,alias)`)
    .filter('academic_year','eq',ayear_id)
    // .filter('is_removed','eq',false)
    .filter('Course.college_id','eq',college_id)
    if(dt_err)
        return {error:dt_err.message}
    return {    
        college,
        dataTable
    }}

 




    












    