<script lang="ts">
	import GraphCreator from './GraphCreator.svelte';
	import Button from '../../components/Button.svelte';
	import Runner from './Runner.svelte';
	import MainLayout from '../../components/MainLayout.svelte';

	let editing = true;

	function handleClick(event: MouseEvent) {
		editing = !editing;
	}
</script>

<MainLayout title="Shortest Path Calculator (Dijkstra)">
	<div slot="description">
		<p>
			In graph theory, the shortest path problem is the problem of finding a path between two
			vertices (or nodes) in a graph such that the sum of the weights of its constituent edges is
			minimized.
		</p>
		<p>
			For a given source node in the graph, the Dijkstra algorithm finds the shortest path between
			that node and every other. The idea is to traverse the graph in a way that visited nodes can
			not be reached through a shorter path. This can be ensured by always following the edge
			between the visited and unvisited nodes which creates the path with the shortest distance from
			the source node. The minimum distance to an unvisited node gets always updated when a new node
			gets visited.
		</p>
	</div>
	<div>
		<Button size="large" color="primary" on:click={handleClick}>
			{editing ? 'Run Algorithmus' : 'Edit Graph'}
		</Button>
	</div>
	<div class="container">
		{#if editing}
			<GraphCreator />
		{:else}
			<Runner />
		{/if}
	</div>
</MainLayout>

<style>
	.container {
		margin-top: 1rem;
	}
</style>
