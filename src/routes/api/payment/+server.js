export async function POST({ url,request }) {
	const dt=await request.text()

	const record1=JSON.parse(dt)
	console.log(record1.customerPhone,record1.customerEmail)
	
	if(record1.status=='Success'){
		const { data, error } = await supabase.from('MQNRIFormInfo')
		.update({ is_payment_done: true })
		.eq('contact', record1.customerPhone)
		.select()
		console.log('****',data);

		if(error){
			console.log('****',error);
		}
	}

	return new Response(dt);
}