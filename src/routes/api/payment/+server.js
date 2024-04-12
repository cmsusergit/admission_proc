import { supabase } from '$lib/db'
export async function POST({ url,request }) {

	const dt=await request.text()
	const record1=JSON.parse(dt)
	console.log(record1)
	if(record1.status=='Success'){
		const { data1, error1 } = await supabase
		.from('MQNRIFormInfo')
		.select("*").like('email', `%${record1.customerEmail}%`)
		console.log('dt::',data1)
	
	
		if(error1)
			console.log('error1::',error1)
		const { data, error } = await supabase.from('MQNRIFormInfo')
		.update({ is_payment_done: true })
		.like('email',`%${record1.customerEmail}%`)
		.select()
		console.log('****',data);
		if(error){
			console.log('Error::',error);
		}
	}
	return new Response(dt);
}