<script lang="ts">
	import { modalStore } from './modalStore.svelte';
	import focusTrap from '../actions/focusTrap';
	import preventScrolling from '../actions/preventScrolling';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { fade, scale } from 'svelte/transition';
	import Button from './Button.svelte';

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

	const { modal, close } = modalStore;
	$inspect('open', modalStore.modal);

	$effect(() => {
		const open = Boolean(modalStore.modal);
		console.log('open', open);
	});
</script>

{#if modal.content}
	<div class="modal" transition:fade={{ duration: 200 }} use:focusTrap use:preventScrolling>
		<div class="backdrop" onclick={modalStore.close}></div>
		<div
			transition:scale={{ duration: 200, start: 0.5 }}
			class="content-wrapper"
			role="dialog"
			aria-label={modalStore.modal.options?.ariaLabelledBy
				? null
				: modalStore.modal.options?.ariaLabel}
			aria-labelledby={modalStore.modal.options?.ariaLabelledBy}
		>
			<Button class="close" onclick={close} icon>X</Button>
			<div class="content">
				<modal.content.component {...modal.content.props} titleId={modal.options?.ariaLabelledBy} />
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
		z-index: 50;
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
		position: absolute;
		max-width: 70vw;
		min-width: 300px;
		border-radius: 0.3rem;
		background-color: white;
		overflow: hidden;
		padding: 2rem;
		z-index: 1;
	}
	div.content {
		max-height: 80vh;
	}

	:global(.close) {
		position: absolute;
		top: 5px;
		right: 5px;
	}
</style>
