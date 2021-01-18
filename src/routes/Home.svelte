<script>
	import { push } from 'svelte-spa-router';
	
	import appConfig from '@@Config/app';
	import { users } from '@@Stores/users';
	import Button from '@@Components/Button.svelte';
	import Header from '@@Components/Header.svelte';
	import { testDidUrl } from '@@Modules/test';
	import { getLoggedInUser } from '@@Modules/user';
	
	const user = getLoggedInUser($users);

</script>

<Header title={appConfig.title} />
<Button label="Register" onclick={() => push('/account/register')} />
<Button label="Login" onclick={() => push('/account/login')} />
<Button label="Manage accounts" onclick={() => push('/account/manage')} />
<Button label="KYC" onclick={() => push('/kyc/home')} disabled={!user} />
<hr />
<Button label="Test DID url" onclick={() => testDidUrl(user)} />
    
<style>

</style>
