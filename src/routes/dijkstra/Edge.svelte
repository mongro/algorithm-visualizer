<script lang="ts">
	import { draw } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { Point } from './GraphData';
	import { browser } from '$app/environment';

	export let start: Point;
	export let end: Point;
	export let text: string;
	export let stroke: string = 'black';
	export let id: string;
	export let curved: boolean = false;
	let endShort: Point;
	let d: string;
	let showAnimationPath: boolean = true;

	function constructLine(start: Point, end: Point) {
		return 'M' + start.x + ' ' + start.y + ' L ' + end.x + ' ' + end.y;
	}

	function handleTransitionEnd(e: AnimationEvent) {
		showAnimationPath = false;
		console.log(e);
	}

	function constructCurve(start: Point, end: Point) {
		const mpx = (start.x + end.x) * 0.5;
		const mpy = (start.y + end.y) * 0.5;

		// angle of perpendicular to line:
		const theta = Math.atan2(end.y - start.y, end.x - start.x) - Math.PI / 2;

		// distance of control point from mid-point of line:
		const offset = -30;

		// location of control point:
		const controlpointX = mpx + offset * Math.cos(theta);
		const controlpointY = mpy + offset * Math.sin(theta);

		return (
			'M' +
			start.x +
			' ' +
			start.y +
			' Q ' +
			controlpointX +
			' ' +
			controlpointY +
			' ' +
			end.x +
			' ' +
			end.y
		);
	}

	$: {
		if (browser) {
			const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			iconPath.setAttribute('d', curved ? constructCurve(start, end) : constructLine(start, end));
			let totalLength = iconPath.getTotalLength();
			endShort = iconPath.getPointAtLength(totalLength - 20);
			d = curved ? constructCurve(start, endShort) : constructLine(start, endShort);
		}
	}
</script>

<g style="cursor:pointer" on:click {id} class="edge">
	{#if endShort}
		<path
			class="clickPath"
			{d}
			stroke-width="8px"
			{stroke}
			marker-end="url(#arrow-{stroke})"
			fill="none"
		/>
		<path
			class="shortPath"
			id={'path' + id}
			{d}
			stroke-width="2px"
			{stroke}
			marker-end="url(#arrow-{stroke})"
			fill="none"
		/>
		{#key stroke}
			<path
				in:draw={{ duration: 1500, easing: quintOut }}
				on:animationend={handleTransitionEnd}
				class="shortPath"
				{d}
				stroke-width="4px"
				{stroke}
				fill="none"
			/>
		{/key}
	{/if}

	<text text-anchor="middle" dy={-3}>
		<textPath startOffset="50%" href="#{'path' + id}" side={start.x - end.x < 0 ? 'left' : 'right'}>
			{text}
		</textPath>
	</text>
</g>

<style>
	.clickPath {
		opacity: 0;
	}

	.edge:hover .shortPath {
		stroke: red;
	}
</style>
