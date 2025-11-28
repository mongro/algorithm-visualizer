<script lang="ts">
	import type Graph from '../../combinatorics/graph';
	import Button from '../../components/Button.svelte';

	import type Node from '../../combinatorics/node';
	import Circle from './Circle.svelte';
	import Edge from './Edge.svelte';
	import { createEventDispatcher } from 'svelte';
	import IconSearchPlus from '~icons/fa7-solid/search-plus';
	import IconSearchMinus from '~icons/fa7-solid/search-minus';
	import type { EdgeData, NodeData } from './GraphData';
	import { COLOR_GREY, COLOR_ORANGE, COLOR_BLUE } from './GraphData';

	export let graph: Graph<NodeData, EdgeData>;
	export let panningEnabled: boolean = true;
	export let selectedNode = '';
	const WIDTH = 700;
	const HEIGHT = 700;
	const MAX_ZOOM = 5;
	const MIN_ZOOM = 0.2;
	const RADIUS = 20;
	let isPanning = false;
	let cachedTouches: PointerEvent[] = [];
	let prevPinchDistance = -1;

	let svg: SVGGraphicsElement;
	let draggedNode: Node<NodeData, EdgeData> | undefined = undefined;
	let zoomFactor = 1.2;
	let vB = { x: 0, y: 0, width: WIDTH, height: HEIGHT };
	let viewBox: string;

	adjustViewPort();

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

	function getBorderBox() {
		let minX = Number.MAX_VALUE;
		let minY = Number.MAX_VALUE;
		let maxX = Number.MIN_VALUE;
		let maxY = Number.MIN_VALUE;
		for (let node of graph.getAllNodes()) {
			minX = Math.min(node.data.point.x - 25, minX);
			minY = Math.min(node.data.point.y - 25, minY);
			maxX = Math.max(node.data.point.x + 25, maxX);
			maxY = Math.max(node.data.point.y + 25, maxY);
		}

		return { minX, minY, maxX, maxY };
	}

	export function adjustViewPort() {
		const borderBox = getBorderBox();
		const neededZoomFactor = Math.max(
			(borderBox.maxX - borderBox.minX) / vB.width,
			(borderBox.maxY - borderBox.minY) / vB.height
		);

		if (neededZoomFactor > 1) {
			vB.width *= neededZoomFactor;
			vB.height *= neededZoomFactor;
		}
		if (
			borderBox.minY < vB.y ||
			borderBox.minX < vB.x ||
			borderBox.maxX > vB.x + vB.width ||
			borderBox.maxY > vB.y + vB.height
		) {
			vB.x = borderBox.minX * 0.5 + borderBox.maxX * 0.5 - 0.5 * vB.width;
			vB.y = borderBox.minY - Math.min(vB.height - (borderBox.maxY - borderBox.minY) * 0.5, 50);
		}
	}
	function handleEdgeClick(event: MouseEvent) {
		const target = event.currentTarget as HTMLElement;
		if (target) {
			const id = target.id;
			const [source, destination] = id.split('-');
			dispatch('edgeClick', { source, destination });
		}
	}

	function handlePointerDown(event: PointerEvent) {
		console.log('touch', event);
		cachedTouches.push(event);

		if (event.target instanceof SVGElement) {
			const node = event.target.closest('.node');
			draggedNode = node ? graph.getNode(node.id) : undefined;
			document.addEventListener('pointermove', handlePointerMove);
			document.addEventListener('pointerup', handlePointerUp);
		}
	}

	function handlePointerUp(event: PointerEvent) {
		event.preventDefault();
		removeEventfromCache(event);
		draggedNode = undefined;
		isPanning = false;
		if (cachedTouches.length < 1) {
			prevPinchDistance = -1;
		}
		if (cachedTouches.length === 0) {
			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', handlePointerUp);
		}
	}

	function handlePointerMove(event: PointerEvent) {
		console.log('handlePointerMove', cachedTouches);

		if (cachedTouches.length === 1) {
			const coords = transformCoords(event.clientX, event.clientY);
			if (!coords) return;
			const { x, y } = coords;
			if (draggedNode) {
				dispatch('nodeMove', { node: draggedNode, x, y });
			} else {
				if (panningEnabled) {
					const prevPoint = transformCoords(cachedTouches[0].clientX, cachedTouches[0].clientY);
					const dx = x - prevPoint.x;
					const dy = y - prevPoint.y;

					vB.x -= dx;
					vB.y -= dy;
					updatePointerCache(event);
				}
			}
		} else if (cachedTouches.length === 2 && event.pointerType === 'touch') {
			updatePointerCache(event);

			const pointer1 = { x: cachedTouches[0].clientX, y: cachedTouches[0].clientY };
			const pointer2 = { x: cachedTouches[1].clientX, y: cachedTouches[1].clientY };
			const currentPinchDistance = getDistanceBetweenPoints(pointer1, pointer2);

			if (prevPinchDistance > 0) {
				const centerPoint = getCenterBetweenPoints(pointer1, pointer2);
				const { x: centerX, y: centerY } = transformCoords(centerPoint.x, centerPoint.y);
				let zoom = prevPinchDistance / currentPinchDistance;
				zoomOnPoint(centerX, centerY, zoom);
			}

			prevPinchDistance = currentPinchDistance;
		}
	}

	function handleCanvasClick(event: MouseEvent) {
		if (event.target && event.target === event.currentTarget && !draggedNode) {
			const coords = transformCoords(event.clientX, event.clientY);
			if (coords) {
				const { x, y } = coords;
				dispatch('canvasClick', { x, y });
			}
		}
	}

	function updatePointerCache(event: PointerEvent) {
		const index = cachedTouches.findIndex((cachedEv) => cachedEv.pointerId === event.pointerId);
		cachedTouches[index] = event;
	}

	function removeEventfromCache(event: PointerEvent) {
		const index = cachedTouches.findIndex((cachedEv) => cachedEv.pointerId === event.pointerId);
		cachedTouches.splice(index, 1);
	}

	function transformCoords(x: number, y: number) {
		let point = new DOMPoint(x, y);
		const ctm = svg.getScreenCTM();
		return ctm !== null ? point.matrixTransform(ctm.inverse()) : point;
	}

	function getDistanceBetweenPoints(
		point1: { x: number; y: number },
		point2: { x: number; y: number }
	) {
		const dx = point1.x - point2.x;
		const dy = point1.y - point2.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function getCenterBetweenPoints(
		point1: { x: number; y: number },
		point2: { x: number; y: number }
	) {
		const x = Math.round((point1.x + point2.x) / 2);
		const y = Math.round((point1.y + point2.y) / 2);
		return { x, y };
	}

	function handleNodeClick(node: Node<NodeData, EdgeData>) {
		dispatch('nodeClick', { node });
	}

	function zoomOnPoint(x: number, y: number, zoom: number) {
		if ((zoom * vB.width) / WIDTH < MIN_ZOOM) {
			zoom = (MIN_ZOOM * WIDTH) / vB.width;
		} else if ((zoom * vB.width) / WIDTH > MAX_ZOOM) {
			zoom = (MAX_ZOOM * WIDTH) / vB.width;
		}
		vB.x -= (x - vB.x) * (zoom - 1);
		vB.y -= (y - vB.y) * (zoom - 1);
		vB.width *= zoom;
		vB.height *= zoom;
	}
	function zoomOnCenter(zoom: number) {
		const cx = vB.x + vB.width / 2;
		const cy = vB.y + vB.height / 2;
		zoomOnPoint(cx, cy, zoom);
	}

	function handleMouseWheel(event: WheelEvent) {
		console.log('onwheel');

		event.preventDefault();
		console.log('onwheel');
		const coords = transformCoords(event.clientX, event.clientY);

		const { x, y } = coords;
		const { deltaY } = event;
		let zoom = deltaY > 0 ? zoomFactor : 1 / zoomFactor;
		zoomOnPoint(x, y, zoom);
	}
</script>

<div class="container" onwheel={handleMouseWheel}>
	<slot name="header" />

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="canvas-wrapper">
		<div class="header">
			<Button onclick={adjustViewPort}>Adjust Workspace</Button>
			<Button icon onclick={() => zoomOnCenter(1 / zoomFactor)}><IconSearchPlus /></Button>
			<Button icon onclick={() => zoomOnCenter(zoomFactor)}><IconSearchMinus /></Button>
			<div class="zoom-display">Zoom: {Math.ceil((WIDTH / vB.width) * 100)}%</div>
		</div>
		<div class="legend">
			<slot name="legend" />
		</div>
		<svg
			class="canvas"
			style="cursor: {isPanning ? 'move' : 'auto'}"
			onclick={handleCanvasClick}
			bind:this={svg}
			{viewBox}
			onwheel={handleMouseWheel}
			onpointerdown={handlePointerDown}
		>
			<defs>
				<!-- A marker to be used as an arrowhead -->
				<marker
					id="arrow-black"
					viewBox="0 0 10 10"
					refX={RADIUS + 6}
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
					refX={RADIUS + 6}
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
					refX={RADIUS + 6}
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
					refX={RADIUS + 6}
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
					refX={RADIUS + 6}
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
						radius={RADIUS}
						text={node.data.text || node.id}
						point={node.data.point}
						fill={node.data.fill || 'white'}
						stroke={selectedNode === node.id ? 'red' : node.data.stroke || 'black'}
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

	.header {
		position: absolute;
		height: 60px;
		display: flex;
		align-items: center;
		z-index: 1;
		padding: 1rem;
		gap: 0.5rem;
	}
	.container {
		background-color: #475569;
		text-align: center;
		width: 100%;
		height: 100%;
		padding: 0.25rem;
	}

	@media only screen and (min-width: 500px) {
		.container {
			padding: 1rem;
		}
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

	.canvas {
		touch-action: none;
	}
</style>
