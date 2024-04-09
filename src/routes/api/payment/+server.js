export async function POST({ url,request }) {
	const dt=await request.text()

	console.log('****',dt);
	return new Response(dt);
}





