<script lang="ts">
	export let title: string;
</script>

<div>
	<h1>{title}</h1>
	<slot name="description" />

	<slot />
</div>
