/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    const id = url.searchParams.get('id')

    let { data:profile, error:dt_err } = await supabase
    .from('ACPCFormInfo')
    .select(`*,Course!inner(*),Branch(name,alias)`)
    .filter('id','eq',id).single()    
    if(dt_err)
        return {error:dt_err.message}
    
    let { data:dt, error:err1 } = await supabase
        .from('AdmissionDocumentACPC').select(`*,document_label!inner(*)`).eq('f_form_id',id) 
    if(err1)
        return {error:formErr.message}        
    const uploadedFileList=dt
    return {    
            profile,
            uploadedFileList
}}


