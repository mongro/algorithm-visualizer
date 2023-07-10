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
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	a {
		padding: 1rem;
		font-size: 20px;
	}
</style>
