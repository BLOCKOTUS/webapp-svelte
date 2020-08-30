<script>
	// external components
	import { push } from 'svelte-spa-router'
	
	// internal components
	import appConfig from '@@Config/app';
	import { users } from "@@Stores/users.js";
	import Button from '@@Components/Button.svelte';
	import Header from '@@Components/Header.svelte';

	$: loggedUser = $users.users.filter(u => u.username === $users.loggedInUser)[0];
</script>

<Header title={appConfig.title} />
<Button label="Register" onclick={() => push('/register/username')} />
<Button label="Login" onclick={() => push('/login/wallet')} />
<Button label="Manage accounts" onclick={() => push('/login/accounts')} disabled />
<Button label="KYC" onclick={() => push('/kyc/home')} disabled={!loggedUser} />
    
<style>

</style>
