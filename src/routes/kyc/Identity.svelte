<script>
	// external components

	// internal components
	import GoBack from '@@Components/GoBack.svelte';
	import Header from '@@Components/Header.svelte';
	import Identity from '@@Components/Identity.svelte';
	import { users } from "@@Stores/users.js";

	$: loggedUser = $users.users.filter(u => u.username === $users.loggedInUser)[0];
</script>

<Header title="Identity" />

<div>
	<Identity identity={loggedUser.identity} />
</div>

<GoBack />

<style>
	
</style>