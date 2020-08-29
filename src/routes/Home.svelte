<script>
	// external components
	import { link } from 'svelte-spa-router'
	
	// internal components
	import appConfig from '@@Config/app';
	import { users } from "@@Stores/users.js";
	import Button from '@@Components/Button.svelte';
	import Header from '@@Components/Header.svelte';
</script>

<div>
	<Header title={appConfig.title} />
	<a href="/register/username" use:link><Button label="Register" /></a>
	<a href="/login/wallet" use:link><Button label="Login" /></a>
	<a href="/login/accounts" use:link><Button label="Manage accounts" disabled /></a>
	<a href="/kyc/home" use:link><Button label={appConfig.apps.kyc.appName} disabled={$users.loggedInUser === null} /></a>
</div>


    
<style>

</style>