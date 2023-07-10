<script lang="ts">
	import { COLOR_BLUE, COLOR_GREY, COLOR_ORANGE } from './GraphData';
</script>

<ul class="explanation">
	<li>
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="50" stroke-width="2px" fill={COLOR_ORANGE} />
		</svg>
		<span>Visited Node</span>
	</li>
	<li>
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="45" stroke-width="8px" stroke={COLOR_ORANGE} fill="none" />
		</svg>
		<span>Unvisited Node that can be reached from visited nodes</span>
	</li>
	<li>
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="45" stroke-width="5px" stroke={COLOR_BLUE} fill="none" />
		</svg>
		<span>Current node that updates shortest distances to unvisited nodes</span>
	</li>
	<li>
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="45" stroke-width="5px" stroke="black" fill="none" />
		</svg>
		<span>Unvisited Node</span>
	</li>
</ul>

<style>
	span {
		text-align: left;
	}
	svg {
		width: 1em;
		height: 1em;
		margin-right: 1rem;
		flex-shrink: 0;
	}
	li {
		font-size: 16px;
		display: flex;
		align-items: center;
		list-style: none;
		margin-bottom: 0.5rem;
	}
</style>
