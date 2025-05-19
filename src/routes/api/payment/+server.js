import { supabase } from '$lib/db'
const createUser = async (email, dob_dt) => {

		const tempD1=new Date(dob_dt)                    
		let pwd1=(''+tempD1.getDate()).padStart(2,'0')+(''+(tempD1.getMonth()+1)).padStart(2,'0')+tempD1.getFullYear()
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password:pwd1,
			email_confirm: true
		})
		if(error){
			console.log(error)

			return
		}
}
export async function POST({ url,request }) {
	const dt=await request.text()
	const record1=JSON.parse(dt)
	console.log(record1)
	if(record1.status=='Success'){
		// const { data:data1, error:error1 } = await supabase
		// .from('MQNRIFormInfo')
		// .select("*").like('father_email', `%${record1.customerEmail}%`)
		// console.log('dt::',data1)	
		// if(error1)
		// 	console.log('error1::',error1)
		const { data, error } = await supabase.from('MQNRIFormInfo')
		.update({ is_payment_done: true })
		.like('email',`%${record1.customerEmail}%`)
		.select()		
		console.log(data);
		if(error){
			console.log('****',error);
		}
		if(data && data.length>0){
			const dob_dt=data[0].dob
			const email=data[0].email
			await createUser(email, dob_dt)
		}else{
			const { data:data1_1, error:error1_1 } = await supabase.from('MQNRIFormInfo')
			.update({ is_payment_done: true })
			.like('father_email',`%${record1.customerEmail}%`)
			.select()
			console.log('****',data1_1)
			if(error1_1){
				console.log('Error::',error1_1);
			}
			if(data1_1){
				const dob_dt=data1_1[0].dob
				const email=data1_1[0].father_email
				await createUser(email, dob_dt)
			}
		}
	}
	return new Response(dt);
}