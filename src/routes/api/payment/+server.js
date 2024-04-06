export async function POST({ url,request }) {
	const dt=await request.text()

	return new Response(dt);
}





