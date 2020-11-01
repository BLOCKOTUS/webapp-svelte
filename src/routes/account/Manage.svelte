<script lang="typescript">
	import { users } from '@@Stores/users';
	import Account from '@@Components/Account.svelte';
	import GoBack from '@@Components/GoBack.svelte';
	import Header from '@@Components/Header.svelte';
	import Info from '@@Components/Info.svelte';
    import type { InfoType } from '@@Modules/info';

	let info: InfoType;
    $: info = { value: '', type: '', loading: false };
</script>

<Header title="Manage accounts" />
<Info info={info} />
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