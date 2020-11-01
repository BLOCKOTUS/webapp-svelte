<script>
	// external components
	import { push } from 'svelte-spa-router';
	
	// internal components
	import Button from '@@Components/Button.svelte';
	import Header from '@@Components/Header.svelte';
	import { users } from '@@Stores/users';

	$: loggedUser = $users.users.filter(u => u.username === $users.loggedInUser)[0];	
</script>

<Header title="KYC" />
<Button label="BLOCKOTUS Home" onclick={() => push('/home')} />
<Button label="My identity" onclick={() => push('/kyc/identity')} disabled={!loggedUser.identity} />
<Button label="Create identity" onclick={() => push('/kyc/getverified')} disabled={loggedUser.identity} />
<Button label="Verification jobs" onclick={() => push('/kyc/jobs')} />

<style>

</style>
