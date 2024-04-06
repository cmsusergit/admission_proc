export async function POST({ url,request }) {
	const dt=await request.formData()
	return new Response(String(dt));
}





