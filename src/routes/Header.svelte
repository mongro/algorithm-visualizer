<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/logo.svg';
	import github from '$lib/images/github.svg';
</script>

<header>
	<nav>
		<ul>
			<li>
				<a href="/">
					<img src={logo} class="home" alt="SvelteKit" />
				</a>
			</li>
			<li aria-current={$page.url.pathname === '/knapsack' ? 'page' : undefined}>
				<a href="/knapsack">Knapsack</a>
			</li>
			<li aria-current={$page.url.pathname === '/binpack' ? 'page' : undefined}>
				<a href="/binpack">Binpack</a>
			</li>
			<li aria-current={$page.url.pathname === '/dijkstra' ? 'page' : undefined}>
				<a href="/dijkstra">Dijkstra</a>
			</li>
			<li>
				<a href="https://github.com/mongro/algorithm-visualizer">
					<img src={github} alt="GitHub" />
				</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: center;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	img.home {
		width: 3em;
		height: 3em;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.4rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	@media only screen and (min-width: 500px) {
		nav a {
			font-size: 0.9rem;
			padding: 0 0.5rem;
		}
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
