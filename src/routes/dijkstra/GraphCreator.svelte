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

	import FaRedo from 'svelte-icons/fa/FaRedo.svelte';
	import type { NodeData, EdgeData } from './GraphData';
	import { graphStore } from './GraphData';
	import FaArrowsAlt from 'svelte-icons/fa/FaArrowsAlt.svelte';
	import FaUndo from 'svelte-icons/fa/FaUndo.svelte';

	import type Node from '../../combinatorics/node';
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaConnectdevelop from 'svelte-icons/fa/FaConnectdevelop.svelte';
	import FaTimesCircle from 'svelte-icons/fa/FaTimesCircle.svelte';
	import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte';

	let selectedNode: Node | null = null;
	let tool = 'addNode';

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
					on:click={() => {
						selectTool('default');
					}}
				>
					<div slot="startIcon">
						<FaArrowsAlt />
					</div>
					<span class="button-text">Move Node/Workspace</span>
				</Button>
			</li>
			<li>
				<Button
					variant={tool === 'addNode' ? 'outlined' : 'contained'}
					on:click={() => {
						selectTool('addNode');
					}}
				>
					<div slot="startIcon">
						<FaPlus />
					</div>
					<span class="button-text">Add Node</span>
				</Button>
			</li>
			<li>
				<Button
					variant={tool === 'delete' ? 'outlined' : 'contained'}
					on:click={() => {
						selectTool('delete');
					}}
					><div slot="startIcon">
						<FaTimesCircle />
					</div>
					<span class="button-text">Delete element</span>
				</Button>
			</li>
			<li>
				<Button
					variant={tool === 'addEdge' ? 'outlined' : 'contained'}
					on:click={() => {
						selectTool('addEdge');
					}}
				>
					<div slot="startIcon">
						<FaConnectdevelop />
					</div>
					<span class="button-text">Add Edge</span></Button
				>
			</li>
			<li>
				<Button variant="contained" on:click={() => removeAllNodes()}
					><div slot="startIcon">
						<FaRegTrashAlt />
					</div>
					<span class="button-text">Remove All</span></Button
				>
			</li>
			<li>
				<Button icon size="small" variant="contained" on:click={() => graphStore.undo()}>
					<FaUndo />
				</Button>
			</li>
			<li>
				<Button icon size="small" variant="contained" on:click={() => graphStore.redo()}>
					<FaRedo />
				</Button>
			</li>
		</ul>
	</div>
</GraphCanvas>

<style>
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
</style>
