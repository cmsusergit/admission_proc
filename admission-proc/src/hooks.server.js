import '$lib/db'
// import { redirect } from '@sveltejs/kit'
// export async function handle({ event, resolve }) {
//     let session = await getServerSession(event)    
//     let role='GUEST'
//     if(session){
//         if(!session.user.user_metadata.role)
//             role='STUDENT'
//         else if(session.user.user_metadata.role=='trustee')
//             role='TRUSTEE'

//         else

//             role='ADMIN'
//     }

//     console.log(role,event.url.pathname);
//     if (role=='GUEST' && !event.url.pathname.startsWith('/admissionform')) {
//         throw redirect(303,'/')
//     }    
//     console.log('----');
//     const response = await resolve(event)
//     return response;
// }
