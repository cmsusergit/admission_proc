// import {supabase} from '$lib/db'
// export const actions = {

//     default: async ({request}) => {                
//         let { data: academicYear, error } = await supabase
//         .from('AcademicYear')
//         .select('id').eq('is_current',true).single()
//         if(error){
//             console.log(error)
//             return {error}
//         }


//         const dt= await request.formData()
//         let dbrecord1={}
//         dt.forEach((record,ob) => {
//             dbrecord1[ob]=record            
//         })
//         dbrecord1['acedemic_year']=academicYear.id
//         const { data:insertDt, error:insertError } = await supabase
//         .from('ProvStudentInfo')
//         .insert([dbrecord1])
//         if(insertError){
//             console.error(insertError)
//             return {success:false,error:insertError}
//         }
//         console.log(insertDt)
//         return {success:true,data:insertDt}











//     }
// }



