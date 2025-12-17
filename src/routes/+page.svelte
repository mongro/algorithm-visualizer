<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Calculators</h1>
	<a href="/binpack">Binpack</a>
	<a href="/knapsack">Knapsack</a>
	<a href="/dijkstra">Dijkstra</a>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	h1 {
		text-align: center;
		margin: 1rem 0;
	}

	a {
		font-size: 20px;
	}
</style>
