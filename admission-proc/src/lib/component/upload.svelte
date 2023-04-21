<script>
	import { createEventDispatcher } from 'svelte'
	import {supabase} from "$lib/db"
	export let size = 10
	export let url,label='Upload'
	export let is_image=false
	export let required=false
	let userPhotoUrl = null
	let uploading = false
	let files
	const dispatch = createEventDispatcher()


	const downloadImage = async (path) => {
		try {
            const { data, error } = await supabase.storage.from('userphoto').download(path)
			if (error) {
				throw error
			}
			const url = URL.createObjectURL(data)
			userPhotoUrl = url
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message)
			}
		}
	}

	const uploadUserPhoto = async () => {
		try {
			uploading = true

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.')
			}
			const file = files[0]
			const fileExt = file.name.split('.').pop()
			const filePath = `${Math.random()}.${fileExt}`
            let { error } = await supabase.storage.from('userphoto').upload(filePath, file)
			if (error) {
				throw error
			}
			url = filePath
			dispatch('upload')
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			uploading = false
		}
	}
	$: if (url) downloadImage(url)
</script>

<div class="">
	{#if is_image && userPhotoUrl}
		<img
			src={userPhotoUrl}
			alt={userPhotoUrl ? 'userPhoto' : 'No image'}
			class=""
			style="height: {size}em; width: {size}em;"
		/>
	<!-- {:else}
		<div class="" style="height: {size}em; width: {size}em;" /> -->
	{/if}
	
	
	
	<div>
		<label class="text-sm font-bold" for="single">{uploading ? 'Uploading ...' : `${label} `}<span hidden={!required} class="text-orange-800 font-bold">*</span></label>
		<input  class="relative m-0 block w-full min-w-0 flex-auto rounded border border-blue-200 bg-clip-padding px-2 text-base font-normal text-neutral-700 transition duration-200 ease-in-out file:-mx-2 file:h-10 file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-blue-500 file:px-2 file:text-white file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-blue-700 file:cursor-pointer focus:border-primary focus:text-blue-700 focus:shadow-[0_0_0_1px] focus:shadow-primary h-10 focus:outline-none" 
			id="single" bind:files on:change={uploadUserPhoto} disabled={uploading} type="file" required={required}>
		<!-- <label class="button-primary cursor-pointer" for="single">
			{uploading ? 'Uploading ...' : 'Upload'}
		</label>
		<input
			style="visibility: hidden; position:absolute;"
			type="file"
			id="single"
			accept="image/*"
			bind:files
            on:change={uploadUserPhoto}
			disabled={uploading}
		/> -->
	</div>
</div>
