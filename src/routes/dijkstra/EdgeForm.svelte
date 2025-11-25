<script lang="ts">
	import { modalStore } from '../../components/modalStore';
	import Button from '../../components/Button.svelte';
	import focusOnMount from '../../actions/focusOnMount';

	export let weight = 1;
	export let onSave: (weight: number) => void;
	export let edit: boolean = false;
	export let source: string;
	export let destination: string;

	function onSubmit() {
		onSave(weight);
		modalStore.close();
	}
</script>

<h1>{edit ? 'Edit edge' : 'Add edge'}</h1>
<form on:submit|preventDefault={onSubmit}>
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
		<Button class="mr-1" onclick={modalStore.close}>Cancel</Button>
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
</style>
