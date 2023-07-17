/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    let { data:aYearList, error:ayear_err } = await supabase
        .from('AcademicYear').select('*')
    if(ayear_err)
        return {error:ayear_err}
    let { data:collegeList, error } = await supabase
        .from('College').select('*')    
    if(error)
        return {error}

    let { data:courseList, error:dt_err } = await supabase
        .from('Course').select('*')    
    if(dt_err)
        return {error:dt_err}
    return {        
        aYearList,
    
        courseList,
        collegeList    
    }
}
