<script lang="typescript">
	import { push } from 'svelte-spa-router';

	import GoBack from '@@Components/GoBack.svelte';
	import Submit from '@@Components/Submit.svelte';
	import Header from '@@Components/Header.svelte';
	import Info from '@@Components/Info.svelte';
	import { users } from '@@Stores/users';
	import { submitRegister } from '@@Modules/login';
    import type { InfoType } from '@@Modules/info';
    import type { UsersType } from '@@Modules/user';

	let info: InfoType;
    $: info = { value: '', type: '', loading: false };
	const onInfo = (i: InfoType) => info = i;
	const onComplete = () => setTimeout(() => push('/'), 1000);
	const setUsers = (u: UsersType) => $users = u;

	$users.tmp.username = '';
</script>

<Header title="Register" />
<Info info={info} />
<form class="content">
	<input type="text" bind:value={$users.tmp.username} placeholder="Username" />
	<Submit onclick={e => submitRegister({ e, users: $users, onInfo, onComplete, setUsers })} disabled={$users.tmp.username.length == 0} />
</form>
    
<GoBack />

<style>
	.content {
		padding-bottom: 3vw;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>