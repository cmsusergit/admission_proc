import { createClient } from '@supabase/auth-helpers-sveltekit'
import { env } from '$env/dynamic/public'

console.log('****')
export const supabase = createClient(env.PUBLIC_SUPABASE_URL1, env.PUBLIC_SUPABASE_ANON_KEY1)

// export const supabase_admin = createClient(env.PUBLIC_SUPABASE_URL, env.ADMIN_ACCESS_CREDENTIAL, {
//     auth: {
//         autoRefreshToken: false,
//         persistSession: false
//     }
//     })