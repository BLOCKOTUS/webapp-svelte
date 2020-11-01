<script lang="typescript">
	import GoBack from '@@Components/GoBack.svelte';
	import Submit from '@@Components/Submit.svelte';
	import Header from '@@Components/Header.svelte';
	import Info from '@@Components/Info.svelte';
	import { users } from '@@Stores/users';
	import { submitRegister } from '@@Modules/login';
    import type { InfoType } from '@@Modules/info';

	let info: InfoType;
    $: info = { value: '', type: '', loading: false };
	const setInfo = (i: InfoType) => info = i;

	$users.tmp.username = '';
</script>

<Header title="Register" />
<Info info={info} />
<form class="content">
	<input type="text" bind:value={$users.tmp.username} placeholder="Username" />
	<Submit onclick={e => submitRegister(e, $users, setInfo)} disabled={$users.tmp.username.length == 0} />
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