<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let total: number = 0;
	export let current: number = 0;

	const width = tweened(0, {
		duration: 400,
		easing: cubicOut
	});
	$: {
		$width = current / total;
		console.log('current', current);
	}
</script>

<div class="container">
	<div class="bar" style="width:{$width * 100}%" />
	<div class="label">
		{current}/{total}
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #71717a;
		width: 120px;
		height: 30px;
		position: relative;
	}
	.bar {
		background-color: #00e676;
		height: 100%;
		position: absolute;
		left: 0;
	}
	.label {
		position: absolute;
		color: black;
	}
</style>
