<script lang="ts">
	import { modalStore } from './modalStore';
	import focusTrap from '../actions/focusTrap';
	import preventScrolling from '../actions/preventScrolling';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			modalStore.close();
		}
	};

	if (browser) document.addEventListener('keydown', handleKeydown);

	onDestroy(() => {
		if (browser) document.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if $modalStore}
	<div class="modal" use:focusTrap use:preventScrolling>
		<div class="backdrop" onclick={modalStore.close} />
		<div class="content-wrapper">
			<div class="content">
				<svelte:component this={$modalStore.component} {...$modalStore.props} />
			</div>
		</div>
	</div>
{/if}

<style>
	div.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;

		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 1;
	}
	div.modal:not(:focus-within) {
		transition: opacity 0.1ms;
		opacity: 0.99;
	}
	div.backdrop {
		background-color: rgba(0, 0, 0, 0.4);
		position: absolute;
		width: 100%;
		height: 100%;
	}

	div.content-wrapper {
		z-index: 10;
		max-width: 70vw;
		min-width: 300px;
		border-radius: 0.3rem;
		background-color: white;
		overflow: hidden;
		padding: 2rem;
	}
	div.content {
		max-height: 80vh;
	}
</style>
