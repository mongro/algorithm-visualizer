<script lang="ts">
	import Button from '../../components/Button.svelte';
	import { modalStore } from '../../components/modalStore';
	import focusOnMount from '../../actions/focusOnMount';
	import type { BinElement } from './types';

	export let onSave: (element: BinElement) => void;

	let quantity = 1;
	let previousQuantity = 1;
	let size = 50;

	function validator(node: HTMLInputElement, quantity: number) {
		return {
			update(value) {
				//console.log(value);
				quantity = value === null || quantity < node.min ? previousQuantity : parseInt(quantity);
				previousQuantity = quantity;
			}
		};
	}

	function onSubmit() {
		onSave({ quantity, size });
		modalStore.close();
	}
</script>

<h1>Add new elements</h1>
<form on:submit|preventDefault={onSubmit}>
	<label for="number">Number of elements to add</label>
	<input
		use:validator={quantity}
		use:focusOnMount
		bind:value={quantity}
		type="number"
		min="1"
		name="number"
		id="number"
	/>

	<label for="size">Size of added elements</label>

	<div class="slider">
		<input type="range" bind:value={size} min="0" max="100" name="size" id="size" />
		<output class="slider-display" for="size">{size}%</output>
	</div>
	<div class="form-footer">
		<Button class="mr-1" on:click={modalStore.close}>Cancel</Button>
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
