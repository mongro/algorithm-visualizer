<script lang="ts">
	import type { Point } from './GraphData';

	export let point: Point;
	export let text = 'A';
	export let stroke = 'black';
	export let fill = 'white';
	export let id: string;
	export let radius: number;
</script>

<g class="node" {id} style="cursor:pointer" transform="translate({point.x},{point.y})" on:click>
	<circle r={radius} stroke-width="2px" {stroke} {fill} />
	<text text-anchor="middle" dy="6px">{text}</text>
</g>

<style>
	.node:hover circle {
		stroke: red;
	}
</style>
