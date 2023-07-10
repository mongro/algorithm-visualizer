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
		This calculator is about the <a href="https://en.wikipedia.org/wiki/Bin_packing_problem"
			>Bin packing problem</a
		>
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
