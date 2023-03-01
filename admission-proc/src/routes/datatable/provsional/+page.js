/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    let { data:dataTable, error:dt_err } = await supabase
    .from('ProvFormInfo').select(`*,Course(college_id,name,alias),Branch(name,alias)`)
    if(dt_err)
        if(dt_err instanceof Error)
            return {error:dt_err.message}
    
    
            return {    

                dataTable
            }}


            