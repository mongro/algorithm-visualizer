<script lang="ts">
	import { fade } from 'svelte/transition';
	export let elements: { index: number; size: number }[];
	export let fillRate: number;
</script>

<div class="bin-container">
	<div class="fillrate">
		{Math.round(fillRate * 10000 + Number.EPSILON) / 100}%
	</div>
	<div class="bin">
		{#each elements.reverse() as { size, index } (index)}
			<div
				in:fade={{ delay: 250 * index, duration: 300 }}
				class="element element--under{Math.floor(size * 10) * 10}"
				style="height:{size * 100}%"
			></div>
		{/each}
	</div>
</div>

<style>
	.fillrate {
		margin-bottom: 5px;
	}
	.bin {
		display: flex;
		flex-direction: column;
		justify-content: end;
		width: 50px;
		height: 100px;
		border: 1px solid black;
	}

	.bin-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 10px;
	}

	.element {
		box-sizing: border-box;
		width: 100%;
		border: 1px solid black;
	}
</style>
