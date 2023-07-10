<script lang="ts">
	export let icon = false;
	export let size = 'default';
	export let variant = 'contained';
	export let color = 'secondary';
	export let type: 'submit' | 'reset' | 'button' | undefined = undefined;
</script>

<button
	{type}
	on:click
	{...$$restProps}
	class="btn size-{size} btn-{variant} btn-{color} {$$restProps.class} "
	class:icon
>
	<slot name="startIcon" class="start-icon" />
	{#if icon}
		<div class="icon-wrapper">
			<slot>Content</slot>
		</div>
	{:else}
		<slot />
	{/if}
</button>

<style>
	.btn {
		outline: 0;
		cursor: pointer;
		border: 0;
		display: inline-flex;
		align-items: center;
		user-select: none;
		font-weight: 500;
		white-space: nowrap;
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
	.start-icon {
		width: 1em;
		height: 1em;
		margin-right: 0.25rem;
	}

	.icon.size-large > .icon-wrapper {
		height: 48px;
		width: 48px;
	}
	.icon.size-default > .icon-wrapper {
		height: 32px;
		width: 32px;
	}
	.icon.size-small > .icon-wrapper {
		height: 24px;
		width: 24px;
	}

	.size-large {
		padding: 1rem;
	}

	.size-default {
		padding: 0.75rem;
	}

	.size-small {
		padding: 0.5rem;
	}

	.size-large:not(.icon) {
		font-size: 1rem;
		padding: 0.5rem 1.15rem;
	}

	.size-default:not(.icon) {
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
	}

	.size-small:not(.icon) {
		font-size: 0.75rem;
		padding: 0.5rem 0.85rem;
	}

	:global([slot='startIcon']) {
		width: 1em;
		height: 1em;
		margin-right: 0.25rem;
	}
</style>
