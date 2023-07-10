<script lang="ts">
	import type Graph from '../../combinatorics/graph';
	import type Node from '../../combinatorics/node';
	import Circle from './Circle.svelte';
	import Edge from './Edge.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { EdgeData, NodeData } from './GraphData';
	import { COLOR_GREY, COLOR_ORANGE, COLOR_BLUE } from './GraphData';

	export let graph: Graph<NodeData, EdgeData>;
	export let panningEnabled: boolean = true;
	const WIDTH = 700;
	const HEIGHT = 700;
	let isPanning = false;
	let centerX = 0;
	let centerY = 0;
	let xOrigin: number | undefined;
	let yOrigin: number | undefined;
	const MAX_ZOOM = 5;
	const MIN_ZOOM = 0.2;
	let svg: SVGGraphicsElement;
	let draggedNode: Node<NodeData, EdgeData> | undefined = undefined;
	let zoomFactor = 1.2;
	let vB = { x: centerX, y: centerY, width: WIDTH, height: HEIGHT };
	let viewBox: string;

	$: {
		viewBox = '' + vB.x + ' ' + vB.y + ' ' + vB.width + ' ' + vB.height;
	}

	interface ComponentEvents {
		edgeClick: { source: string; destination: string };
		canvasClick: { x: number; y: number };
		canvasMove: { dx: number; dy: number };
		nodeClick: { node: Node<NodeData, EdgeData> };
		nodeMove: { node: Node<NodeData, EdgeData>; x: number; y: number };
		zoomChange: { scale: number };
	}

	const dispatch = createEventDispatcher<ComponentEvents>();

	function handleEdgeClick(event: MouseEvent) {
		const target = event.currentTarget as HTMLElement;
		if (target) {
			const id = target.id;
			const [source, destination] = id.split('-');
			dispatch('edgeClick', { source, destination });
		}
	}

	function handleMouseDown(event: MouseEvent) {
		if (panningEnabled) {
			const coords = transformCoords(event);
			if (!coords) return;
			const { x, y } = coords;
			xOrigin = x;
			yOrigin = y;
			isPanning = true;
		}
		if (event.target instanceof SVGElement) {
			const node = event.target.closest('.node');
			draggedNode = node ? graph.getNode(node.id) : undefined;
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}
	}

	function handleMouseUp(event: MouseEvent) {
		draggedNode = undefined;
		isPanning = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(event: MouseEvent) {
		const coords = transformCoords(event);
		if (!coords) return;
		const { x, y } = coords;

		if (draggedNode) {
			dispatch('nodeMove', { node: draggedNode, x, y });
		} else {
			if (isPanning && xOrigin && yOrigin) {
				const dx = x - xOrigin;
				const dy = y - yOrigin;

				vB.x -= dx;
				vB.y -= dy;
			}
		}
	}

	function handleCanvasClick(event: MouseEvent) {
		if (event.target && event.target === event.currentTarget && !draggedNode) {
			const coords = transformCoords(event);
			if (coords) {
				const { x, y } = coords;
				dispatch('canvasClick', { x, y });
			}
		}
	}

	function transformCoords(event: MouseEvent) {
		let point = new DOMPoint(event.clientX, event.clientY);
		const ctm = svg.getScreenCTM();
		return ctm !== null ? point.matrixTransform(ctm.inverse()) : undefined;
	}

	function handleNodeClick(node: Node<NodeData, EdgeData>) {
		dispatch('nodeClick', { node });
	}

	function handleMouseWheel(event: WheelEvent) {
		event.preventDefault();
		const coords = transformCoords(event);
		if (coords) {
			const { x, y } = coords;
			let startPoint = { x, y };
			const { deltaY } = event;
			let zoom = deltaY > 0 ? zoomFactor : 1 / zoomFactor;
			if ((zoom * vB.width) / WIDTH < MIN_ZOOM) {
				zoom = (MIN_ZOOM * WIDTH) / vB.width;
			} else if ((zoom * vB.width) / WIDTH > MAX_ZOOM) {
				zoom = (MAX_ZOOM * WIDTH) / vB.width;
			}
			vB.x -= (startPoint.x - vB.x) * (zoom - 1);
			vB.y -= (startPoint.y - vB.y) * (zoom - 1);
			vB.width *= zoom;
			vB.height *= zoom;

			dispatch('zoomChange', { scale: vB.width / WIDTH });
		}
	}
</script>

<div class="container">
	<slot name="header" />

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="canvas-wrapper">
		<div class="legend">
			<div class="zoom-display">Zoom: {Math.ceil((vB.width / WIDTH) * 100)}%</div>
			<slot name="legend" />
		</div>
		<svg
			class="canvas"
			style="cursor: {isPanning ? 'move' : 'auto'}"
			on:click={handleCanvasClick}
			bind:this={svg}
			{viewBox}
			on:wheel={handleMouseWheel}
			on:mousedown={handleMouseDown}
		>
			<defs>
				<!-- A marker to be used as an arrowhead -->
				<marker
					id="arrow-black"
					viewBox="0 0 10 10"
					refX="10"
					refY="6"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
				</marker>
				<marker
					id="arrow-{COLOR_ORANGE}"
					viewBox="0 0 10 10"
					refX="10"
					refY="6"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" fill={COLOR_ORANGE} />
				</marker>
				<marker
					id="arrow-{COLOR_BLUE}"
					viewBox="0 0 10 10"
					refX="10"
					refY="6"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" fill={COLOR_BLUE} />
				</marker>
				<marker
					id="arrow-{COLOR_BLUE}"
					viewBox="0 0 10 10"
					refX="10"
					refY="6"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" fill={COLOR_BLUE} />
				</marker>
				<marker
					id="arrow-{COLOR_GREY}"
					viewBox="0 0 10 10"
					refX="10"
					refY="6"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M 0 0 L 10 5 L 0 10 z" fill={COLOR_GREY} />
				</marker>
			</defs>
			<g id="edges">
				{#each graph.getAllNodes() as node (node.id)}
					{#each [...node.adjacentNodes] as [adjacentId, data] (adjacentId)}
						{@const adjacentNode = graph.getNode(adjacentId)}
						{#if adjacentNode}
							<Edge
								id="{node.id}-{adjacentId}"
								on:click={handleEdgeClick}
								start={{ x: node.data.point.x, y: node.data.point.y }}
								end={{
									x: adjacentNode.data.point.x,
									y: adjacentNode.data.point.y
								}}
								text={'' + data.weight}
								stroke={data.stroke || 'black'}
								curved={adjacentNode.hasSuccessor(node.id) !== undefined}
							/>
						{/if}
					{/each}
				{/each}
			</g>
			<g id="nodes">
				{#each graph.getAllNodes() as node (node.id)}
					<Circle
						on:click={() => handleNodeClick(node)}
						id={node.id}
						text={node.data.text || node.id}
						point={node.data.point}
						fill={node.data.fill || 'white'}
						stroke={node.data.stroke || 'black'}
					/>
				{/each}
			</g>
		</svg>
	</div>
</div>

<style>
	.legend {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
		background-color: #f4f4f5;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: end;
	}
	.container {
		background-color: #475569;
		text-align: center;
		width: 100%;
		height: 100%;
		padding: 1rem;
	}

	.canvas-wrapper {
		background-color: #f1f5f9;
		user-select: none;
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.zoom-display {
		padding: 1rem;
	}
</style>
