<script lang="ts">
	import Button from '../../components/Button.svelte';

	import { createEventDispatcher } from 'svelte';
	let items: { id: number; value: number; weight: number }[];
	let maxWeight: number;

	items = [
		{ id: 0, value: 1, weight: 1 },
		{ id: 1, value: 4, weight: 3 },
		{ id: 2, value: 5, weight: 4 },
		{ id: 3, value: 7, weight: 5 }
	];
	let currentId: number = items.length;
	maxWeight = 7;

	const dispatch = createEventDispatcher<ComponentEvents>();
	interface ComponentEvents {
		calculate: { items: { value: number; weight: number }[]; maxWeight: number };
	}

	function handleClick() {
		dispatch('calculate', { items, maxWeight });
		console.log('dispatch', items);
	}

	function addItem() {
		items = [...items, { id: currentId, value: 1, weight: 1 }];
		currentId++;
	}

	function deleteItem(index: number) {
		console.log('delete', index);
		items = [...items.slice(0, index), ...items.slice(index + 1)];

		console.log(items);
	}
</script>

<div class="knapsack_form">
	<div class="grid">
		<div class="head cell">Items</div>
		<div class="head cell">Values</div>
		<div class="head cell">Weights</div>
		<div class="head cell" />

		{#each items as item, index (item.id)}
			<div class="cell">
				<span>{'Item ' + (index + 1)}</span>
			</div>
			<div class="cell">
				<input type="number" bind:value={item.value} min="1" />
			</div>
			<div class="cell">
				<input type="number" bind:value={item.weight} min="1" />
			</div>
			<div class="cell">
				<Button color="primary" on:click={() => deleteItem(index)}>
					{'Remove'}
				</Button>
			</div>
		{/each}
	</div>
	<div class="form_footer">
		<div class="weight_input">
			<label for="maxWeight">Knapsack Capacity</label>
			<input id="maxWeight" name="maxWeight" type="number" bind:value={maxWeight} />
		</div>

		<Button class="mr-2" color="primary" on:click={addItem}>
			{'Add Item'}
		</Button>
		<Button size="large" color="secondary" on:click={handleClick}>
			{'Calculate'}
		</Button>
	</div>
</div>

<style>
	.head {
		font-weight: bold;
	}

	.cell {
		padding: 0.5rem;
	}

	input {
		width: 100%;
		padding: 0.5rem 1rem;
	}

	.form_footer {
		display: flex;
		flex-wrap: wrap;
		margin-top: 1rem;
		align-items: center;
		gap: 0.5rem;
	}

	label {
		margin-right: 0.5rem;
		font-weight: bold;
	}

	.weight_input {
		display: flex;
		align-items: center;
		margin-right: 0.5rem;
	}

	.knapsack_form {
		margin-bottom: 2rem;
	}

	.grid {
		width: 100%;

		display: grid;
		grid-template-columns: 15% repeat(2, 1fr) auto;
	}
</style>
