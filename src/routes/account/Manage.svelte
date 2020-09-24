<script>
	import { users } from '@@Stores/users.js';
	import Account from '@@Components/Account.svelte';
	import GoBack from '@@Components/GoBack.svelte';
	import Header from '@@Components/Header.svelte';
	import Info from '@@Components/Info.svelte';

	$: infoValue = '';
	$: infoType = '';
	$: infoLoading = false;
</script>

<Header title="Manage accounts" />
<Info value={infoValue} type={infoType} loading={infoLoading} />
<div class="flex-container">
{#each $users.users as user}
	<Account account={user} />
{/each}
</div>

<GoBack />

<style>
	.flex-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>