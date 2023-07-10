<script lang="ts">
	import BinComponent from './Bin.svelte';
	import type { Bin } from './types';

	export let bins: Bin[];
	$: averageFillRate = bins.reduce((sum, bin) => sum + bin.fillRate, 0) / bins.length;
</script>

<div class="bins-container">
	{#each bins as { fillRate, elements }, i}
		<BinComponent {fillRate} {elements} />
	{/each}
</div>
<div>
	<div class="result">
		<div class="result-header">Number of containers</div>
		<div class="result-value">{bins.length}</div>
	</div>
	<div class="result">
		<div class="result-header">Fillrate of containers</div>
		<div class="result-value">
			{Math.round(averageFillRate * 10000 + Number.EPSILON) / 100}%
		</div>
	</div>
</div>

<style>
	.bins-container {
		display: flex;
		justify-content: center;
	}

	.result {
		display: flex;
		align-items: center;
	}

	.result-header {
		font-size: 1rem;
		padding: 1rem;
	}

	.result-value {
		font-size: 1.15rem;
		font-weight: 600;
		padding: 1rem;
	}
</style>
