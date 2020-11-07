<script lang="typescript">
	import GoBack from '@@Components/GoBack.svelte';
	import Header from '@@Components/Header.svelte';
	import Identity from '@@Components/Identity.svelte';
	import Info from '@@Components/Info.svelte';
	import { users } from "@@Stores/users";
	import { getMyIdentity } from '@@Modules/identity';
	import { getLoggedInUser } from '@@Modules/user';
	import type { InfoType } from '@@Modules/info';

	let info: InfoType;
	const onInfo = (i: InfoType) => info = i;
	const user = getLoggedInUser($users);
	
	const getMyIdentityPromise = getMyIdentity({ user, onInfo });
</script>

<Header title="Identity" />
<Info info={info} />
{#await getMyIdentityPromise then getMyIdentityRes}
	<Identity 
		identity={getMyIdentityRes}
	/>
{/await}
<GoBack />

<style>
	
</style>
