/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load(event) {
    
    let { data:aYearList, error:ayear_err } = await supabase
        .from('AcademicYear').select('*')
    if(ayear_err)
        return {error:ayear_err}
    let { data:collegeList, error } = await supabase
        .from('College').select('*')


    if(error)
        return {error}
    return {    
        aYearList,
        collegeList
    }
}




