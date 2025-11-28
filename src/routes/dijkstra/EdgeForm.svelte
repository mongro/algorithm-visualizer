<script lang="ts">
	import { modalStore } from '../../components/modalStore.svelte';
	import Button from '../../components/Button.svelte';
	import focusOnMount from '../../actions/focusOnMount';

	type EdgeFormProps = {
		weight?: number;
		edit?: boolean;
		destination: string;
		source: string;
		titleId?: string;
		onSave: (weight: number) => void;
	};
	let { weight = 1, onSave, edit = false, source, destination, titleId }: EdgeFormProps = $props();

	console.log('title', titleId);

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		onSave(weight);
		modalStore.close();
	}
</script>

<h1 id={titleId}>{edit ? 'Edit edge' : 'Add edge'}</h1>
<form onsubmit={onSubmit}>
	<label for="edgeWeight">Weight of edge {source} to {destination}</label>
	<input
		use:focusOnMount
		bind:value={weight}
		step="any"
		type="number"
		min="1"
		name="edgeWeight"
		id="edgeWeight"
	/>
	<div class="form-footer">
		<Button type="button" class="mr-1" onclick={modalStore.close}>Cancel</Button>
		<Button type="submit">Confirm</Button>
	</div>
</form>

<style>
	.form-footer {
		display: flex;
		justify-content: right;
		margin-top: 0.5rem;
		padding: 0.5rem;
	}

	label {
		margin-bottom: 0.5rem;
		display: block;
	}

	h1 {
		margin-bottom: 1rem;
	}
</style>
