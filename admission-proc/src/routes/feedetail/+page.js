/** @type {import('./$types').PageLoad} */
import { supabase } from '$lib/db'

export async function load({ params,url }) {
    const form_type = url.searchParams.get('form_type')
    const id = url.searchParams.get('id')
    const tableToFetch=(form_type.includes('acpc'))?'ACPCFormInfo':(form_type.includes('vacant'))?'VacantFormInfo':'MQNRIFormInfo'
    console.log(form_type,tableToFetch)
    let { data: formInfo, error } = await supabase
        .from(tableToFetch)
        .select('*,AcademicYear(*),Course(*)')        
        .eq('id',id).single()

    if(error)
    {
        return error
    }
    // 
    // const feeTableToFetch=(form_type.includes('acpc'))?'AdmissionFeesCollectionACPC':'AdmissionFeesCollectionACPC'    
    const formType=(form_type.includes('acpc'))?'ACPC':(form_type.includes('vacant'))?'VACANT':'MQNRI' 
    const formIdText=(form_type.includes('acpc'))?'form_id':(form_type.includes('vacant'))?'vacant_form_id':'mqnri_form_id'
    console.log('----',formIdText)
    let { data: feeFormInfo, error:feeError1 } = await supabase
        .from('AdmissionFeesCollectionACPC')
        .select('*,AcademicYear(*),Course(*, College(*)),Branch(*)')        
        .eq(formIdText,id).eq('form_type',formType)
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

    console.log('----',feeFormInfo)
    if(feeFormInfo.length>0){
        return {
            feeFormInfo,
            courseList,
            form_type,
            feeSchemeList,
            formInfo,
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
    }}