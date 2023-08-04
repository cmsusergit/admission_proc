/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    const id = url.searchParams.get('id')

    let { data:profile, error:dt_err } = await supabase
    .from('VacantFormInfo')
    .select(`*,Course!inner(*),Branch(name,alias)`)
    .filter('id','eq',id).single()    
    if(dt_err)
        return {error:dt_err.message}
    
    let merit_number=[]
    if(profile.admission_category=='M' || profile.admission_category=='B'){
        let { data:meritdt1, error:err1_1 } = await supabase.from('mq_meritnumber').select(`*`).eq('id',profile.id).single()
        if(err1_1)
            return {error:err1_1.message}   
        merit_number.push({category:'M',number:meritdt1.merit_number})
    }
    if(profile.admission_category=='N' || profile.admission_category=='B'){
        let { data:meritdt1, error:err1_1 } = await supabase.from('nri_meritnumber').select(`*`).eq('id',id).single()
        if(err1_1)
            return {error:err1_1.message}       
        merit_number.push({category:'N',number:meritdt1.merit_number})
    }
    let { data:dt, error:err1 } = await supabase
        .from('AdmissionDocumentVacant').select(`*,document_label!inner(*)`).eq('f_form_id',id) 
    if(err1)
        return {error:err1.message}        
    const uploadedFileList=dt






    return {    
            profile,
            merit_number,
            uploadedFileList
}}


