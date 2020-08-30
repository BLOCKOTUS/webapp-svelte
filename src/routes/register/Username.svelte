<script>
	// external components
	import { RSA } from 'hybrid-crypto-js';
	import axios from 'axios';

	// internal components
	import appConfig from '@@Config/app';
	import GoBack from '@@Components/GoBack.svelte';
	import Submit from '@@Components/Submit.svelte';
	import Header from '@@Components/Header.svelte';
	import Info from '@@Components/Info.svelte';
	import { users } from "@@Stores/users.js";

	$: infoValue = '';
	$: infoType = '';
	$: infoLoading = false;

	const rsa = new RSA();
	
	const generateKeyPair = () => {
    	return new Promise((resolve) => {
			rsa.generateKeyPair(resolve);
		})
	}


	const register = async (e) => {
		e.preventDefault();

		infoLoading = true;

		// generate keypair
		const keypair = await generateKeyPair();

		// get wallet from the network
		const res = await axios.post(appConfig.nerves.user.url, {
			username: $users.tmp.username,
			publicKey: keypair.publicKey
		}).catch(e => {
			infoType = 'error';
			infoValue = e.message;
		});

		if(!res) return;

		const { wallet, id, success, message } = res.data;

		infoType = success ? 'info' : 'error';
		infoValue = message;
		infoLoading = false;

		const user = {
			username: $users.tmp.username,
			wallet,
			keypair,
			id
		}

		const currentUsers = $users.users;
		const newUsers = [...currentUsers, user];
		$users.users = newUsers;

		$users.loggedInUser = $users.tmp.username;
		$users.tmp.username = '';
	}

	$users.tmp.username = '';
</script>

<Header title="Register" />
<form class="content">
	<Info value={infoValue} type={infoType} loading={infoLoading} />
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

	.error-area {
		background: #f7cfcf;
		width: 100%;
		margin-bottom: 40px;
		display: none;
	}
</style>