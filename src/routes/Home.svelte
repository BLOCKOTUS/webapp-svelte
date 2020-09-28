<script>
	import { push } from 'svelte-spa-router';
	
	import appConfig from '@@Config/app';
	import { users } from '@@Stores/users';
	import Button from '@@Components/Button.svelte';
	import Header from '@@Components/Header.svelte';
	
	$: loggedUser = $users.users.filter(u => u.username === $users.loggedInUser)[0];
</script>

<Header title={appConfig.title} />
<Button label="Register" onclick={() => push('/account/register')} />
<Button label="Login" onclick={() => push('/account/login')} />
<Button label="Manage accounts" onclick={() => push('/account/manage')} />
<Button label="KYC" onclick={() => push('/kyc/home')} disabled={!loggedUser} />
    
<style>

</style>
