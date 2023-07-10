<script lang="ts">
	import Form from './Form.svelte';
	import MainLayout from '../../components/MainLayout.svelte';

	import { knapsack } from '../../combinatorics/algorithms';
	import type { CellData, KnapSackData } from './ArrayData';
	import Player from '../../components/Player.svelte';
	import UndoRedoStore, { type Command } from '../../stores/Undo';

	let items: { value: number; weight: number }[];
	let maxWeight: number;
	let ksMatrix: number[][];
	let solution: number[];

	let knapSackStore: UndoRedoStore<KnapSackData> | undefined;

	$: {
		console.log('stack', $knapSackStore?.redoStack);
	}

	function handleCalculate(
		event: CustomEvent<{ items: { value: number; weight: number }[]; maxWeight: number }>
	) {
		const { items: _items, maxWeight: _maxWeight } = event.detail;
		items = _items;
		maxWeight = _maxWeight;
		const values = items.map((item) => item.value);
		const weights = items.map((item) => item.weight);
		const result = knapsack(values, weights, maxWeight);
		ksMatrix = result.DP;
		solution = result.items;
		console.log('items', result.items);
		const cellBasis: CellData = { value: 0, status: 'default' };
		knapSackStore = new UndoRedoStore({
			array: ksMatrix.map((row) => row.map(() => cellBasis)),
			currentItem: 0,
			currentWeight: 1
		});
		knapSackStore.setRedoStack(result.steps.reverse());
	}
</script>

<svelte:head>
	<title>Knapsack Calculator</title>
	<meta
		name="description"
		content="Calculator that solves the knapsack problem and visualizes the results."
	/>
</svelte:head>
<MainLayout title="Knapsack Calculator">
	<div slot="description">
		<p>
			Given a set of items, each with a weight and a value. The Knapsack problem is to determine
			which items to include in the collection so that the total weight is less than or equal to a
			given limit and the total value is as large as possible.
		</p>
		<p>
			If the weights are integers, an optimal solution can be found in pseudo-polynomial time by
			breaking it down into simpler sub-problems. After you run the algorithm, you will see a table
			showing the solutions of the subproblems. The cell (i,j) contains the maximum value that can
			be attained with weight less than or equal to j by only using items 1 to i.
		</p>
	</div>
	<Form on:calculate={handleCalculate} />
	{#if solution}
		<div class="solution">
			The optimal solution is to choose items {solution.join(', ')} with a total weight of
			{solution.reduce((weight, index) => weight + items[index - 1].weight, 0)} and a total value of
			{ksMatrix[ksMatrix.length - 1][ksMatrix[ksMatrix.length - 1].length - 1]}
		</div>
	{/if}
	{#if $knapSackStore}
		{@const currentItem = $knapSackStore?.state.currentItem}
		{@const currentWeight = $knapSackStore?.state.currentWeight}
		<Player undoRedoStore={$knapSackStore} />
		<div class="container">
			<div class="side">
				<div class="cell cell_header">
					<span> Values </span>
				</div>
				<div class="cell cell_header">
					<span> Weights </span>
				</div>
				{#each items as item, i}
					<div class="cell {$knapSackStore?.state.currentItem === i ? 'A' : ''}">
						<span>
							{item.value}
						</span>
					</div>
					<div class="cell {$knapSackStore?.state.currentItem === i ? 'weight_cell' : ''}">
						<span>
							{item.weight}
						</span>
					</div>
				{/each}
			</div>
			<div class="knapsack_array" style="--rows: {items.length + 2};--columns: {maxWeight + 2}">
				<div
					class="cell cell_header {currentItem > -1 && 0 > currentWeight - items[currentItem].weight
						? 'alarm'
						: ''}"
				/>
				{#each Array(maxWeight + 1) as _, i}
					<div
						class="cell cell_header {currentItem > -1 &&
						i >= currentWeight - items[currentItem].weight &&
						i <= currentWeight
							? 'weight_cell'
							: ''}"
					>
						<span>
							{i}
						</span>
					</div>
				{/each}
				{#each Array(items.length + 1) as _, i}
					<div class="cell cell_left">
						<span>
							{i}
						</span>
					</div>
				{/each}
				{#each $knapSackStore.state.array as row}
					{#each row as unit}
						<div class="cell {unit.status}">
							<span>
								{unit.value}
							</span>
						</div>
					{/each}
				{/each}
			</div>
		</div>
	{/if}
</MainLayout>

<style>
	.container {
		display: flex;
		flex-wrap: nowrap;
		align-items: end;
		gap: 1rem;
	}
	.cell.alarm {
		background-color: #991b1b;
	}

	.cell.weight_cell {
		background-color: #f59e0b;
	}
	.A {
		background-color: blue;
	}
	.B {
		background-color: green;
	}
	.default {
		background-color: black;
	}

	.side {
		display: grid;
		grid-gap: 0.5rem;
		max-width: 300px;
		grid-template-rows: repeat(var(--rows), auto);
		grid-template-columns: repeat(2, minmax(50px, 70px));
		background-color: black;
		color: white;
		padding: 0.5rem;
	}

	.knapsack_array {
		display: grid;
		grid-gap: 0.5rem;
		grid-template-rows: repeat(var(--rows), auto);
		grid-template-columns: repeat(var(--columns), minmax(50px, 70px));
		grid-auto-flow: row dense;
		background-color: black;
		color: white;
		padding: 0.5rem;
	}

	.cell {
		width: 100%;
		padding-bottom: 100%;
		position: relative;
		box-shadow: 0 0 0 0.5rem white;
	}

	.cell > span {
		max-width: 100%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		position: absolute;
	}

	.cell_left {
		background-color: #525252;
		grid-column: 1 / span 1;
	}

	.cell_header {
		background-color: #525252;
		grid-row: 1 / span 1;
	}

	.solution {
		padding: 1rem;
		margin: 2rem 0;
		font-size: 1.25rem;
		border: 2px solid black;
		border-radius: 5px;
	}
</style>
