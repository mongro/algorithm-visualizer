<script lang="ts">
	import Button from './Button.svelte';
	import { onDestroy } from 'svelte';
	import ProgressBar from '../components/ProgressBar.svelte';
	import type UndoRedoStore from '../stores/Undo';
	import type Graph from '../combinatorics/graph';
	import type { EdgeData, NodeData } from '../routes/dijkstra/GraphData';
	type T = $$Generic;
	export let undoRedoStore: UndoRedoStore<T>;
	let playSpeed = 1;
	let isPlaying: boolean = false;
	let autoPlayId: number;

	onDestroy(() => {
		if (autoPlayId) {
			clearTimeout(autoPlayId);
		}
	});

	function playStep() {
		undoRedoStore.redo();
		if (undoRedoStore.getRedoStackLength() > 0) {
			autoPlayId = window.setTimeout(playStep, 500 / playSpeed);
		} else {
			isPlaying = false;
		}
	}

	function replay() {
		undoRedoStore.undoAll();
		start();
	}

	function start() {
		isPlaying = true;
		autoPlayId = window.setTimeout(playStep, 500 / playSpeed);
	}

	function pause() {
		if (isPlaying) {
			clearTimeout(autoPlayId);
			isPlaying = false;
		}
	}

	function next() {
		pause();
		undoRedoStore.redo();
	}
	function previous() {
		pause();
		undoRedoStore.undo();
	}
</script>

<div class="header">
	<div class="slider">
		<label for="speed">Speed</label>
		<input type="range" bind:value={playSpeed} min="1" max="5" name="speed" id="speed" />
		<output class="slider-display" for="speed">{playSpeed}X</output>
	</div>
	<Button size="large" color="primary" on:click={previous}>Previous Step</Button>
	<ProgressBar
		total={undoRedoStore.getTotalCommands()}
		current={undoRedoStore.getHistoryLength()}
	/>
	<Button size="large" color="primary" on:click={next}>Next Step</Button>
	{#if !isPlaying}
		{#if undoRedoStore.getRedoStackLength() > 0}
			<Button size="large" color="primary" on:click={start}>Play</Button>
		{:else}
			<Button size="large" color="primary" on:click={replay}>Replay</Button>
		{/if}
	{:else}
		<Button size="large" color="primary" on:click={pause}>Pause</Button>
	{/if}
</div>

<style>
	.slider {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		padding: 0.5rem;
	}

	label {
		padding-right: 0.25rem;
	}

	.slider-display {
		font-size: 16px;
		margin-left: 10px;
	}

	.header {
		background-color: #cbd5e1;
		padding: 0.5rem;
		margin: 0;
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
</style>
