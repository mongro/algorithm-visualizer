<script lang="ts">
	import Button from './Button.svelte';
	import { onDestroy } from 'svelte';
	import ProgressBar from '../components/ProgressBar.svelte';
	import type UndoRedoStore from '../stores/Undo';
	import FaPause from 'svelte-icons/fa/FaPause.svelte';
	import FaPlay from 'svelte-icons/fa/FaPlay.svelte';
	import FaCaretRight from 'svelte-icons/fa/FaCaretRight.svelte';
	import FaCaretLeft from 'svelte-icons/fa/FaCaretLeft.svelte';
	import FaReply from 'svelte-icons/fa/FaReply.svelte';
	type T = $$Generic;
	export let undoRedoStore: UndoRedoStore<T>;
	const DEFAULT_SPEED = 1000;
	let speedMultiplicator = 1;
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
			autoPlayId = window.setTimeout(playStep, DEFAULT_SPEED / speedMultiplicator);
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
		autoPlayId = window.setTimeout(playStep, DEFAULT_SPEED / speedMultiplicator);
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
	<Button size="small" color="primary" on:click={previous}>
		<div slot="startIcon">
			<FaCaretLeft />
		</div>
		<div class="button-text">Previous Step</div>
	</Button>
	<ProgressBar
		total={undoRedoStore.getTotalCommands()}
		current={undoRedoStore.getHistoryLength()}
	/>
	<Button size="small" color="primary" on:click={next}>
		<div slot="startIcon">
			<FaCaretRight />
		</div>
		<div class="button-text">Next Step</div>
	</Button>
	{#if !isPlaying}
		{#if undoRedoStore.getRedoStackLength() > 0}
			<Button color="secondary" on:click={start}>
				<div slot="startIcon">
					<FaPlay />
				</div>
				<div class="button-text">Play</div></Button
			>
		{:else}
			<Button color="secondary" on:click={replay}>
				<div slot="startIcon">
					<FaReply />
				</div>
				<div class="button-text">Replay</div></Button
			>
		{/if}
	{:else}
		<Button color="secondary" on:click={pause}>
			<div slot="startIcon">
				<FaPause />
			</div>
			<div class="button-text">Pause</div>
		</Button>
	{/if}
	<div class="slider">
		<label for="speed">Speed</label>
		<input type="range" bind:value={speedMultiplicator} min="1" max="5" name="speed" id="speed" />
		<output class="slider-display" for="speed">{speedMultiplicator}X</output>
	</div>
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
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	@media only screen and (max-width: 600px) {
		.button-text {
			display: none;
		}
	}
</style>
