<script lang="ts">
	import GraphCanvas from './Graph.svelte';
	import Button from '../../components/Button.svelte';
	import EdgeForm from './EdgeForm.svelte';
	import { modalStore } from '../../components/modalStore';
	import {
		removeEdgeCommand,
		removeNodeCommand,
		addEdgeCommand,
		addNodeCommand,
		changeEdgeDataCommand,
		removeAllNodesCommand
	} from '../../combinatorics/graphCommands';
	import {
		type NodeData,
		type EdgeData,
		initializeGraphStoreFromUrl,
		initializeGraphStoreWithExample,
		graphStore
	} from './GraphData';
	import type Node from '../../combinatorics/node';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import IconRedo from '~icons/fa7-solid/redo';
	import IconUndo from '~icons/fa7-solid/undo';
	import IconPlus from '~icons/fa7-solid/plus';
	import IconTrashAlt from '~icons/fa7-solid/trash-alt';
	import IconTimesCircle from '~icons/fa7-solid/times-circle';
	import IconEdge from '~icons/fa7-solid/arrows-alt-h';
	import IconCross from '~icons/fa7-solid/arrows-alt';
	import LZString from 'lz-string';
	import { createNotification } from '../../components/notificationState.svelte';
	import { fade } from 'svelte/transition';

	let selectedNode: Node | null = null;
	let tool = $state('addNode');

	const graphParam = page.url.searchParams.get('graph');
	graphParam ? initializeGraphStoreFromUrl(graphParam) : initializeGraphStoreWithExample();

	const removeEdge = (source: string, destination: string) => {
		graphStore.execute(new removeEdgeCommand(source, destination));
	};
	const removeNode = (id: string) => {
		graphStore.execute(new removeNodeCommand(id));
	};

	const removeAllNodes = () => {
		graphStore.execute(new removeAllNodesCommand());
	};
	const addEdge = (source: string, destination: string, data: EdgeData) => {
		graphStore.execute(new addEdgeCommand(source, destination, data));
	};
	const addNode = (id: string, data: NodeData) => {
		graphStore.execute(new addNodeCommand(id, data));
	};

	const changeEdgeData = (source: string, destination: string, data: EdgeData) => {
		graphStore.execute(new changeEdgeDataCommand<NodeData, EdgeData>(source, destination, data));
	};
	const changeNodeData = (id: string, data: Partial<NodeData>) => {
		graphStore.updateState((graph) => {
			const node = graph.getNode(id);
			node?.changeData(data);
			return graph;
		});
	};

	let notification = createNotification();

	function selectTool(s: string) {
		tool = s;
		if (selectedNode) changeNodeData(selectedNode.id, { stroke: 'black' });
		selectedNode = null;
	}

	function handleNodeClick(event: CustomEvent<{ node: Node }>) {
		const node = event.detail.node;

		switch (tool) {
			case 'delete':
				removeNode(node.id);
				break;
			case 'addEdge':
				if (selectedNode === null) {
					selectedNode = node;
					changeNodeData(node.id, { stroke: 'red' });
				} else if (selectedNode !== node) {
					modalStore.open(EdgeForm, {
						onSave: (weight: number) => {
							if (selectedNode === null) return;
							addEdge(selectedNode.id, node.id, { weight });
							changeNodeData(selectedNode.id, { stroke: 'black' });
							selectedNode = null;
						},
						source: selectedNode.id,
						destination: node.id
					});
				}
		}
	}

	function handleNodeMove(
		event: CustomEvent<{ node: Node<NodeData, EdgeData>; x: number; y: number }>
	) {
		if (tool === 'default') {
			const { node, x, y } = event.detail;
			changeNodeData(node.id, { point: { x, y } });
		}
	}

	function handleEdgeClick(event: CustomEvent<{ source: string; destination: string }>) {
		const { source, destination } = event.detail;
		if (tool === 'delete') {
			removeEdge(source, destination);
		} else if (tool === 'addEdge') {
			const weight = (
				($graphStore.state.getNode(source) as Node).getEdgeData(destination) as EdgeData
			).weight;
			modalStore.open(EdgeForm, {
				weight,
				onSave: (weight: number) => {
					changeEdgeData(source, destination, { weight });
				},
				source,
				destination,
				edit: true
			});
		}
	}

	function graphToUrl() {
		const json = $graphStore.state.toJSON();
		const text = JSON.stringify(json);

		const url = LZString.compressToEncodedURIComponent(text);
		const searchParams = page.url.searchParams;
		searchParams.set('graph', url);
		replaceState(page.url, {});
		notification.triggerShow();
	}

	function handleClick(event: CustomEvent<{ x: number; y: number }>) {
		//noElement clicked
		if (tool === 'addNode') {
			const { x, y } = event.detail;
			let index = 0;
			while ($graphStore.state.hasNode(String.fromCharCode(65 + index))) {
				index++;
			}
			const id = String.fromCharCode(65 + index);
			addNode(id, { point: { x, y } });
		}
	}
</script>

<GraphCanvas
	graph={$graphStore.state}
	panningEnabled={tool === 'default'}
	on:nodeClick={handleNodeClick}
	on:edgeClick={handleEdgeClick}
	on:canvasClick={handleClick}
	on:nodeMove={handleNodeMove}
>
	<div slot="header" class="header">
		<ul class="tabs">
			<li>
				<Button
					variant={tool === 'default' ? 'outlined' : 'contained'}
					onclick={() => {
						selectTool('default');
					}}
				>
					<IconCross />
					<span class="button-text">Move Node/Workspace</span>
				</Button>
			</li>
			<li>
				<Button
					variant={tool === 'addNode' ? 'outlined' : 'contained'}
					onclick={() => {
						selectTool('addNode');
					}}
				>
					<IconPlus />
					<span class="button-text">Add Node</span>
				</Button>
			</li>
			<li>
				<Button
					variant={tool === 'delete' ? 'outlined' : 'contained'}
					onclick={() => {
						selectTool('delete');
					}}
				>
					<IconTimesCircle />
					<span class="button-text">Delete element</span>
				</Button>
			</li>
			<li>
				<Button
					variant={tool === 'addEdge' ? 'outlined' : 'contained'}
					onclick={() => {
						selectTool('addEdge');
					}}
				>
					<IconEdge />
					<span class="button-text">Add Edge</span></Button
				>
			</li>
			<li>
				<Button variant="contained" onclick={() => removeAllNodes()}>
					<IconTrashAlt />
					<span class="button-text">Remove All</span></Button
				>
			</li>
			<li>
				<Button icon variant="contained" onclick={() => graphStore.undo()}>
					<IconUndo />
				</Button>
			</li>
			<li>
				<Button icon variant="contained" onclick={() => graphStore.redo()}>
					<IconRedo />
				</Button>
			</li>
			<li>
				<div class="relative">
					<Button variant="contained" color="primary" onclick={graphToUrl}>Save</Button>
					{#if notification.show}
						<div class="notification" transition:fade>Graph stored in updated URL.</div>
					{/if}
				</div>
			</li>
		</ul>
	</div>
</GraphCanvas>

<style>
	.relative {
		position: relative;
	}
	.tabs {
		list-style: none;
		display: flex;
		grid-gap: 1rem;
		margin: 0;
		padding: 0.25rem;
		align-items: center;
		flex-wrap: wrap;
	}

	@media only screen and (max-width: 600px) {
		.button-text {
			display: none;
		}
	}

	.notification {
		position: absolute;
		left: 110%;
		top: 0;
		width: 22rem;
		background-color: white;
		box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
		padding-block: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;

		z-index: 100;
		border: 1px solid hsl(0, 0%, 20%);
		border-radius: 5px;
	}
</style>
