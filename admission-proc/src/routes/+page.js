/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({}) {
    let { data:aYearList, error:ayear_err } = await supabase
        .from('AcademicYear').select('*')
    if(ayear_err)
        return {error:ayear_err}
    let { data:collegeList, error } = await supabase
        .from('College').select('*')
    if(error)
        return {error}

    let { data:dataTable, error:dt_err } = await supabase
        .from('ProvFormInfo').select(`*,Course(college_id)`)
    if(dt_err)
        if(dt_err instanceof Error)
            return {error:dt_err.message}
    return {    
        aYearList,
        dataTable,
        collegeList
    };      
}



