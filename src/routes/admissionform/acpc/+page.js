/** @type {import('./$types').PageLoad} */ 
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    const is_update = url.searchParams.get('is_update')
    const college_id = url.searchParams.get('college_id')    
    const ayear_id = url.searchParams.get('ayear_id')  
    let { data:academicYear, error:ayear_err } = await supabase
        .from('AcademicYear').select('*').eq('id',ayear_id).single()
    if(ayear_err)
        return {error:ayear_err}


    let { data:college, error } = await supabase
        .from('College').select('*').eq('id',college_id).single()
    if(error)
        if(error instanceof Error)        
        return {error:error.message}
    let { data:dt, error:err1 } = await supabase
        .from('Course').select(`*,Branch(*)`).eq('college_id',college_id)
        if(err1)
        if(err1 instanceof Error)
        return {error:err1.message}
    const courselist=dt    
    let { data:uploadLabelList, error:err1_1 } = await supabase
        .from('document_label').select('*').eq('college_id',college_id)
    if(err1_1)
        if(err1_1 instanceof Error)        
        return {error:err1_1.message}
    let formDt,uploadFileList
    if(is_update){
        
        
        
        
        
        
        
        
        let { data, error:formErr } = await supabase
            .from('ACPCFormInfo').select(`*`).eq('id',is_update).single() 
        if(formErr)
            return {error:formErr.message}        
        let { data:dt, error:err1 } = await supabase
            .from('AdmissionDocumentACPC').select(`*`).eq('f_form_id',is_update) 
        if(formErr)
            return {error:formErr.message}        
        uploadFileList=dt
        formDt=data
    }
    return {    
    academicYear,
    college,
    courselist,
    uploadLabelList,
    formDt,

    uploadFileList
}}