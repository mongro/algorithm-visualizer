<script lang="ts">
	import Button from '../../components/Button.svelte';
	import { modalStore } from '../../components/modalStore';
	import focusOnMount from '../../actions/focusOnMount';
	import type { BinElement } from './types';

	interface PropsNewElement {
		onSave: (element: BinElement) => void;
	}

	const { onSave }: PropsNewElement = $props();

	let quantity = $state(1);
	let size = $state(50);

	function validateInput() {
		return quantity > 0 && size < 101 && size > 0;
	}

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (validateInput()) {
			onSave({ quantity, size });
			modalStore.close();
		}
	}
</script>

<h1>Add new elements</h1>
<form onsubmit={onSubmit}>
	<label for="number">Number of elements to add</label>
	<input use:focusOnMount bind:value={quantity} type="number" min="1" name="number" id="number" />

	<label for="size">Size of added elements</label>

	<div class="slider">
		<input type="range" bind:value={size} min="0" max="100" name="size" id="size" />
		<output class="slider-display" for="size">{size}%</output>
	</div>
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

	.slider {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
	}

	.slider-display {
		font-size: 16px;
		margin-left: 10px;
	}

	label {
		margin-bottom: 0.5rem;
		display: block;
	}

	input {
		margin-bottom: 0.75rem;
	}
</style>
