<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		children,
		icon = false,
		size = 'default',
		color = 'secondary',
		variant = 'contained',
		ref = $bindable(null),
		...restProps
	}: HTMLButtonAttributes & {
		icon?: boolean;
		size?: 'large' | 'default' | 'small';
		variant?: 'outlined' | 'contained';
		color?: 'primary' | 'secondary';
		ref?: HTMLButtonElement | null;
	} = $props();
</script>

<button
	{...restProps}
	class="btn size-{size} btn-{variant} btn-{color} {restProps.class} "
	class:icon
	bind:this={ref}
>
	{@render children?.()}
</button>

<style>
	.btn {
		outline: 0;
		cursor: pointer;
		border: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		font-weight: 500;
		white-space: nowrap;
		gap: 0.25rem;
	}

	.btn-outlined.btn-primary:hover {
		background-color: #eff6ff;
		color: #2563eb;
		border: 1px #2563eb;
	}
	.btn-outlined.btn-primary {
		background-color: #f8fafc;
		color: #2563eb;
		border: 1px #60a5fa;
	}

	.btn-contained.btn-primary:hover {
		background-color: #1e3a8a;
		color: #f8fafc;
	}
	.btn-contained.btn-primary {
		background-color: #2563eb;
		color: #f8fafc;
	}
	.btn-outlined.btn-secondary:hover {
		background-color: #f8fafc;
		color: #374151;
		border: 1px #111827;
	}
	.btn-outlined.btn-secondary {
		background-color: #f8fafc;
		color: #374151;
		border: 1px #374151;
	}

	.btn-contained.btn-secondary:hover {
		background-color: #111827;
		color: #f8fafc;
	}
	.btn-contained.btn-secondary {
		background-color: #374151;
		color: white;
	}

	.icon {
		border-radius: 50%;
	}

	.size-large:not(.icon) {
		padding: 1rem;
		font-size: 1.75rem;
	}

	.size-default:not(.icon) {
		padding: 0.75rem;
		font-size: 1.25rem;
	}

	.size-small:not(.icon) {
		padding: 0.5rem;
		font-size: 1rem;
	}

	.size-large.icon {
		width: 3rem;
		height: 3rem;
		font-size: 1.25rem;
	}

	.size-default.icon {
		width: 2.25rem;
		height: 2.25rem;
		font-size: 1rem;
	}

	.size-small.icon {
		width: 1.75rem;
		height: 1.75rem;
		font-size: 0.75rem;
	}

	:global([slot='startIcon']) {
		width: 1em;
		height: 1em;
	}
</style>
