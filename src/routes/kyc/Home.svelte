<script>
	// external components
	import { link } from 'svelte-spa-router'
	
	// internal components
	import appConfig from '@@Config/app';
	import Button from '@@Components/Button.svelte';
	import Header from '@@Components/Header.svelte';
	import { users } from "@@Stores/users.js";

	$: loggedUser = $users.users.filter(u => u.username === $users.loggedInUser)[0];
</script>

<div>
    <Header title="KYC" />
    <a href="/home" use:link><Button label="BLOCKOTUS Home" /></a>
    <a href="/kyc/identity" use:link><Button label="My identity" disabled={!loggedUser.identity} /></a>
    <a href="/kyc/getverified" use:link><Button label="Create identity" disabled={loggedUser.identity} /></a>
    <a href="/kyc/jobs" use:link><Button label="Verify" /></a>
</div>
<style>

</style>