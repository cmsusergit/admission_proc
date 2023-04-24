import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	plugins: [sveltekit()],
	moduleContext: {
		'./node_modules/pdfmake/build/vfs_fonts.js': 'window',
	}
};

export default config;
