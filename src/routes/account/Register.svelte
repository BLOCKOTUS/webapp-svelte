<script lang="typescript">
	import { RSA } from 'hybrid-crypto-js';

	import appConfig from '@@Config/app';
	import GoBack from '@@Components/GoBack.svelte';
	import Submit from '@@Components/Submit.svelte';
	import Header from '@@Components/Header.svelte';
	import Info from '@@Components/Info.svelte';
	import { users } from '@@Stores/users';
	import { request } from '@@Modules/nerves';
	import { generateKeyPair } from '@@Modules/crypto';

    import type { InfoType } from '@@Components/Info';

	let info: InfoType;
    $: info = { value: '', type: '', loading: false };

	const rsa = new RSA();

	const register = async (e: Event) => {
		e.preventDefault();

		info.loading = true;
		info.value = '';
		info.type = 'info';

		// generate keypair
		const keypair = await generateKeyPair();

		// get wallet from the network
		const res = await request({
			method: 'POST',
			url: appConfig.nerves.user.url,
			data: {
				username: $users.tmp.username,
				publicKey: keypair.publicKey,
			},
		}).catch(e => {
			info.type = 'error';
			info.value = e.message;
		});

		if(!res) return;

		const { wallet, id, success, message } = res.data;

		info.type = success ? 'info' : 'error';
		info.value = message;
		info.loading = false;
		if (!success) return;

		const user = {
			username: $users.tmp.username,
			wallet,
			keypair,
			id,
		};

		const currentUsers = $users.users;
		const newUsers = [...currentUsers, user];
		$users.users = newUsers;

		$users.loggedInUser = $users.tmp.username;
		$users.tmp.username = '';
	};
</script>

<Header title="Register" />
<Info info={info} />
<form class="content">
	<input type="text" bind:value={$users.tmp.username} placeholder="Username" />
	<Submit onclick={register} disabled={$users.tmp.username.length == 0} />
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