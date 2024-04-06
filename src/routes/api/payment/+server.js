import { error } from '@sveltejs/kit';
export async function POST({ url,request }) {
	
	const dt=await request.formData()
	console.log(dt);
	return new Response("done");
}


