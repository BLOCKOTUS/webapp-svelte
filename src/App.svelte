<script>
	// external components
	import Router from 'svelte-spa-router'
	import {wrap} from 'svelte-spa-router'

	// internal components
	import appConfig from './config/app';
	import Button from './components/Button.svelte';

	// routes
	import Home from './routes/Home.svelte';
	import Verify from './routes/Verify.svelte';
	import GetVerified from './routes/GetVerified.svelte';
	import Success from './routes/Success.svelte';

	const routes = {
		'/': Home,
		'/verify/:jobId?': Verify,
		'/getverified': GetVerified,
		'/success': Success,
		'*': Home,
	}

	// execution
	document.title = appConfig.title;
</script>

<main>
	<Router {routes}/>
</main>

<style>
	main {
		text-align: center;
		margin: 0 auto;
	}

	:global(h1) {
		color: #ff3e00;
		font-size: 10vw;
		font-weight: 100;
		margin: 4.2vw;
	}

	:global(form) {
		font-size: 3vw;
	}

	:global(input) {
		display: flex;
	} 

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>