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

    let { data:feesCategoryList, error:err1 } = await supabase
        .from('AdmissionFeesCategory').select('*')
    if(err1)
        return {error:err1}
    let { data:feesSchemeList, error:dterr1 } = await supabase
        .from('AdmissionFeesScheme').select('*')
    if(dterr1)
        return {error:dterr_1}
    let { data:courseList, error:dterr } = await supabase
        .from('Course').select('*')
    if(dterr)
        return {error:dterr}







        return {        
        aYearList,
        courseList,
        feesSchemeList,
        feesCategoryList,
        collegeList    
    }
}
