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
		if(!url)
			userPhotoUrl=''
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
			dispatch('upload',url)
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			uploading = false
		}
	}
	$: downloadImage(url)
	const getAcceptedType=()=>{
		return is_image?'image/png,image/jpeg':'*'
	}
	const removeUploadedFile=async()=>{
		dispatch('removeFile')
	}
</script>









<div class="">
	{#if is_image && userPhotoUrl}
		<img
			src={userPhotoUrl}
			alt={userPhotoUrl ? 'userPhoto' : 'No image'}
			class=""
			style="height: {size}em; width: {size}em;"
		/>
	{/if}
	<div>
		{#if !is_image && userPhotoUrl}
			<div class="border p-2 flex justify-between">
				<a class="m-2 text-orange-800 px-2 hover:text-orange-700 py-2 underline font-bold" href="{userPhotoUrl}">
					{label}<span hidden={!required} class="text-orange-800 font-bold">*</span>
				</a>
				<button type="button" on:click={removeUploadedFile} class="m-2 p-2 border bg-orange-800 hover:bg-orange-700 text-white rounded">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17 22H7C5.89543 22 5 21.1046 5 20V7H3V5H7V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V5H21V7H19V20C19 21.1046 18.1046 22 17 22ZM7 7V20H17V7H7ZM9 4V5H15V4H9ZM15 18H13V9H15V18ZM11 18H9V9H11V18Z" fill="currentColor"/> </svg>
				</button>
			</div>
		{:else}		
			<div class="border p-1">
				<label class="text-sm font-bold" for="single">{uploading ? 'Uploading ...' : `${label} `}<span hidden={!required} class="text-orange-800 font-bold">*</span></label>
				<input accept="{getAcceptedType()}" max-file-size="2048" class="relative m-0 block w-full min-w-0 flex-auto rounded border border-blue-200 bg-clip-padding px-2 text-base font-normal text-neutral-700 transition duration-200 ease-in-out file:-mx-2 file:h-10 file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-blue-500 file:px-2 file:text-white file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-blue-700 file:cursor-pointer focus:border-primary focus:text-blue-700 focus:shadow-[0_0_0_1px] focus:shadow-primary h-10 focus:outline-none" 
					id="single" bind:files on:change={uploadUserPhoto} disabled={uploading} type="file" required={required}>
			</div>
		{/if}
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
