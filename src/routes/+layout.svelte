<script lang="ts">
	import Header from './Header.svelte';
	import './styles.css';
	import Modal from '../components/Modal.svelte';
</script>

<div class="app">
	<Header />
	<main>
		<slot />
	</main>
	<Modal />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media only screen and (min-width: 500px) {
		main {
			padding: 1rem;
		}
	}
</style>
