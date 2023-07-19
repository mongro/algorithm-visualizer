<script lang="ts">
	import {
		changeEdgeDataCommand,
		changeNodeDataCommand,
		batchCommand
	} from '../../combinatorics/graphCommands';
	import FaAngleRight from 'svelte-icons/fa/FaAngleRight.svelte';
	import { dijkstra, type DijkstraStep } from '../../combinatorics/algorithms';
	import GraphCanvas from './Graph.svelte';
	import type Node from '../../combinatorics/node';
	import { COLOR_GREY, COLOR_ORANGE, COLOR_BLUE, type NodeData, type EdgeData } from './GraphData';
	import UndoRedoStore from '../../stores/Undo';
	import { graphStore } from './GraphData';
	import type { Command } from '../../stores/Undo';
	import Player from '../../components/Player.svelte';
	import type Graph from '../../combinatorics/graph';
	import Explanation from './Explanation.svelte';

	const clonedGraph = new UndoRedoStore($graphStore.state.cloneGraph());
	let distances: Map<string, number>;
	let legendIsOpen = true;

	function handleNodeClick(e: CustomEvent<{ node: Node }>) {
		if (!distances) {
			const startNode = e.detail.node.id;
			const result = dijkstra($clonedGraph.state, startNode);
			const commands = transformStepsIntoCommands(result.steps);
			distances = result.distances;
			clonedGraph.setRedoStack(commands.reverse());
		}
	}

	function handleClick(event: MouseEvent) {
		legendIsOpen = !legendIsOpen;
	}

	function transformStepsIntoCommands(steps: DijkstraStep[]) {
		return steps.reduce<Command<Graph<NodeData, EdgeData>>[]>((commands, step) => {
			const { action, data } = step;

			switch (action) {
				case 'initializing':
					const batchCmd = new batchCommand<Graph<NodeData, EdgeData>>();
					for (let node of $clonedGraph.state.getAllNodes()) {
						batchCmd.add(
							new changeNodeDataCommand<NodeData, EdgeData>(node.id, {
								text: node.id + ': ' + (data.start === node.id ? '0' : '∞')
							})
						);
					}
					return [...commands, batchCmd];
				case 'consider_node':
					return [
						...commands,
						new changeNodeDataCommand<NodeData, EdgeData>(data.node, {
							stroke: COLOR_BLUE
						})
					];
				case 'consider_edge':
					return [
						...commands,
						new changeEdgeDataCommand<NodeData, EdgeData>(data.from, data.to, {
							stroke: COLOR_BLUE
						})
					];
				case 'distance_unchanged':
					return [
						...commands,
						new changeEdgeDataCommand<NodeData, EdgeData>(data.from, data.to, {
							stroke: COLOR_GREY
						})
					];

				case 'update_distance':
					const batch = new batchCommand<Graph<NodeData, EdgeData>>();
					batch.add(
						new changeEdgeDataCommand<NodeData, EdgeData>(data.from, data.to, {
							stroke: COLOR_ORANGE
						})
					);
					batch.add(
						new changeNodeDataCommand<NodeData, EdgeData>(data.to, {
							text: data.to + ': ' + data.dist,
							stroke: COLOR_ORANGE
						})
					);

					return [...commands, batch];
				case 'shortest_distance_calculated':
					return [
						...commands,
						new changeNodeDataCommand<NodeData, EdgeData>(data.node, {
							fill: COLOR_ORANGE,
							stroke: COLOR_ORANGE
						})
					];
				case 'no_more_reachable':
					return [
						...commands,
						new changeNodeDataCommand<NodeData, EdgeData>(data.node, {
							fill: COLOR_GREY
						})
					];
			}
		}, []);
	}
</script>

<GraphCanvas graph={$clonedGraph.state} on:nodeClick={handleNodeClick}>
	<div slot="header" class="header">
		{#if distances}
			<Player undoRedoStore={$clonedGraph} />
		{:else}
			<div>Please select a start node</div>
		{/if}
	</div>
	<div slot="legend">
		{#if distances}
			<button class="button-hide" on:click={handleClick}>
				<span class="arrow" class:right={!legendIsOpen}>
					<FaAngleRight />
				</span>
			</button>
			<div class="explanation" class:show={legendIsOpen}>
				<Explanation />
			</div>
		{/if}
	</div>
</GraphCanvas>

<style>
	.arrow {
		width: 32px;
		height: 32px;
		transition: transform 0.5s ease;
	}

	.right {
		transform: rotate(180deg);
	}

	.show.explanation {
		transform: translateX(0);
	}

	.explanation {
		background-color: #f5f5f5;
		min-width: 300px;
		transform: translateX(100%);
		position: absolute;
		right: 0;
		transition: transform 0.5s ease;
	}
	.button-hide {
		outline: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
	}

	.header {
		background-color: #cbd5e1;
		padding: 0.5rem;
	}
</style>
