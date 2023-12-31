<script lang="ts">
	import Bins from './Bins.svelte';
	import Elements from './Elements.svelte';
	import Button from '../../components/Button.svelte';
	import MainLayout from '../../components/MainLayout.svelte';
	import { nextFit, firstFitDecrease } from '../../combinatorics/algorithms';
	import type { Bin, BinElement } from './types';

	let elements = <BinElement[]>[
		{ size: 0.2, quantity: 1 },
		{ size: 0.8, quantity: 1 },
		{ size: 0.4, quantity: 1 },
		{ size: 0.3, quantity: 1 },
		{ size: 0.7, quantity: 1 },
		{ size: 0.9, quantity: 1 },
		{ size: 0.6, quantity: 1 }
	];
	let calculated = false;
	let counter = 0;
	let binsNF = <Bin[]>[];
	let binsFFD = <Bin[]>[];

	function handleClick(e: MouseEvent) {
		binsNF = nextFit(elements);
		binsFFD = firstFitDecrease(elements);
		calculated = true;
		counter++;
	}

	function addElements(element: BinElement) {
		const { size, quantity } = element;
		const i = elements.findIndex((element) => element.size === size / 100);
		if (i > -1) {
			elements = elements.map((ele, index) =>
				index === i ? { ...ele, quantity: ele.quantity + quantity } : ele
			);
		} else {
			elements = [...elements, { size: size / 100, quantity }];
		}
	}

	function removeElement(index: number) {
		elements = elements.filter((ele, i) => index !== i);
	}
</script>

<svelte:head>
	<title>Bin Packing Calculator</title>
	<meta
		name="description"
		content="Calculator that solves the bin packing problem and compares the results between next-fit and first-fit approach."
	/>
</svelte:head>
<MainLayout title="Bin Packing Calculator">
	<div slot="description">
		<p>
			The bin packing problem is a classic optimization problem in computer science and operations
			research. It involves packing a set of items of different sizes into a minimum number of bins,
			each with a fixed capacity. The goal is to find an efficient packing arrangement that
			minimizes the number of bins used while ensuring that the total size of the items in each bin
			does not exceed its capacity. It is considered a challenging problem with practical
			applications in logistics, resource allocation, and scheduling.
		</p>
		<p>There are many heuristics that follow the same simple scheme:</p>
		<ol>
			<li>Take the next item from the collection.</li>
			<li>If it is possible, put it into one of the currently open bins.</li>
			<li>Open a new bin otherwise.</li>
		</ol>
		<p>
			The <b>Next-Fit</b> algorithm keeps only one bin open and the <b>First-Fit</b> algorithm keeps
			all bins open and considers them in the order in which they were opened.
		</p>
	</div>
	<Elements {elements} on:removeElement={(e) => removeElement(e.detail)} {addElements} />
	<Button on:click={handleClick}>Calculate</Button>
	{#key counter}
		{#if calculated}
			<h2>Next Fit</h2>
			<Bins bins={binsNF} />
			<h2>First Fit Decreasing</h2>
			<Bins bins={binsFFD} />
		{/if}
	{/key}
</MainLayout>

<style>
	:global(.element--under10) {
		background-color: #ffe4e6;
	}

	:global(.element--under20) {
		background-color: #fecdd3;
	}
	:global(.element--under30) {
		background-color: #fda4af;
	}
	:global(.element--under40) {
		background-color: #fb7185;
	}
	:global(.element--under50) {
		background-color: #f43f5e;
	}
	:global(.element--under100) {
		background-color: #4c0519;
	}

	:global(.element--under60) {
		background-color: #e11d48;
	}
	:global(.element--under70) {
		background-color: #be123c;
	}
	:global(.element--under80) {
		background-color: #9f1239;
	}
	:global(.element--under90) {
		background-color: #881337;
	}
</style>
