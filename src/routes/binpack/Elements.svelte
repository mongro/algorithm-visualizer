<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte';
	import Button from '../../components/Button.svelte';
	import { modalStore } from '../../components/modalStore';
	import NewElement from './NewElement.svelte';
	import type { BinElement } from './types';

	export let elements: BinElement[];
	export let addElements: (element: BinElement) => void;

	const dispatch = createEventDispatcher();

	function onRemove(index: number) {
		dispatch('removeElement', index);
	}
</script>

<div class="input-display">
	{#each elements as { size, quantity }, index}
		<div class="element-container">
			<div class="quantity">{quantity} X</div>
			<div class="size">{Math.round(size * 10000 + Number.EPSILON) / 100}%</div>
			<div class="element-box">
				<div
					class="element element--under{Math.floor(size * 10) * 10}"
					style="height:{size * 100}%"
				/>
			</div>
			<Button icon on:click={() => onRemove(index)} size="small"><FaTrashAlt /></Button>
		</div>
	{/each}
	<Button on:click={() => modalStore.open(NewElement, { onSave: addElements })} icon>
		<FaPlus />
	</Button>
</div>

<style>
	.input-display {
		display: flex;
		justify-content: flex-start;
		align-items: end;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.element {
		width: 100%;
	}
	.size {
		margin-bottom: 5px;
	}

	.element-box {
		display: flex;
		flex-direction: column;
		height: 100px;
		width: 100%;
		margin-bottom: 15px;
		justify-content: end;
	}

	.element-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: end;
		width: 40px;
		padding: 0.25rem;
	}

	@media (min-width: 640px) {
		.input-display {
			gap: 0.5rem;
		}
		.element-container {
			width: 40px;
		}
	}

	@media (min-width: 900px) {
		.input-display {
			gap: 0.5rem;
		}
		.element-container {
			width: 50px;
		}
	}
</style>
