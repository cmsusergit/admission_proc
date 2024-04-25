import { supabase } from '$lib/db'
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
		const { data:data1_1, error:error1_1 } = await supabase.from('MQNRIFormInfo')
		.update({ is_payment_done: true })
		.like('father_email',`%${record1.customerEmail}%`)
		.select()
		console.log('****',data1_1)
		if(error1_1){
			console.log('Error::',error1_1);
		}
	}
	return new Response(dt);
}