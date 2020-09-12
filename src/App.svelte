<script>
	// external components
	import Router from 'svelte-spa-router'
	import {wrap} from 'svelte-spa-router'

	// internal components
	import appConfig from './config/app';
	import Button from '@@Components/Button.svelte';

	// routes
	import Home from '@@Routes/Home.svelte';
	import { KYCRoutes } from '@@Routes/kyc/routes';
	import { AccountRoutes } from '@@Routes/account/routes';

	const routes = {
		'/': Home,
		...KYCRoutes,
		...AccountRoutes,
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
		font-size: 60px;
		font-weight: 100;
		margin: 4.2vw;
	}

	:global(form) {
		font-size: 30px;
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