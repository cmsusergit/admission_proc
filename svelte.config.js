import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		
		alias:{
			'lib':'./lib/'
		}
	},
	preprocess: vitePreprocess()
};

export default config;
