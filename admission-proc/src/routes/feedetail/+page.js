/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    const form_type = url.searchParams.get('form_type')
    const id = url.searchParams.get('id')
    const tableToFetch=(form_type.includes('acpc'))?'ACPCFormInfo':'MQNRIFormInfo'
    console.log(form_type,tableToFetch)
    let { data: formInfo, error } = await supabase
        .from(tableToFetch)
        .select('*,AcademicYear(*),Course(*)')        
        .eq('id',id).single()

    if(error)
    {
        return error
    }
    const feeTableToFetch=(form_type.includes('acpc'))?'AdmissionFeesCollectionACPC':'AdmissionFeesCollectionMQNRI'    
    let { data: feeFormInfo, error:feeError1 } = await supabase
        .from(feeTableToFetch)
        .select('*,AcademicYear(*),Course(*, College(*)),Branch(*)')        
        .eq('form_id',id)
    if(feeError1)
    {
        return feeError1
    }   
    let { data:courseList, error:error1 } = await supabase
        .from('Course').select(`*,Branch(*)`)
    if(error1)
        return {error:error1.message}
    let { data:feeSchemeList, error:fs_error } = await supabase
        .from('AdmissionFeesScheme').select(`*,AdmissionSubFeesInfo(*,AdmissionFeesCategory(*))`)
    if(fs_error)
        return {error:fs_error.message} 
    if(feeFormInfo.length>0){
        return {
            feeFormInfo,
            feeSchemeList,
            ayear_id:formInfo.academic_year,
            college_id:formInfo.Course.college_id,
            error:`Record Already Exists For Form ID ${id}`}
    }        

    let { data:prov2acpc, error:errorp } = await supabase
    .from('prov_acpc').select(`acpc_id`).eq('acpc_id',id)
    if(errorp)
        return {error:errorp.message}
    return {    
        feeSchemeList,
        form_type,
        courseList,
        formInfo,        
        prov2acpc
    }
}