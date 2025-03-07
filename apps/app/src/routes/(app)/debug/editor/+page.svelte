<script lang="ts">
	import { Editor } from '@scribere/editor';

	let json = $state('');
</script>

<div class="flex h-screen w-screen flex-row gap-4 p-4">
	<Editor
		class="h-full w-1/2"
		onupdate={(new_state) => {
			json = JSON.stringify(new_state.doc.toJSON(), null, 2);
		}}
	/>
	<pre class="h-full w-1/2 overflow-y-auto">{json}</pre>
</div>
