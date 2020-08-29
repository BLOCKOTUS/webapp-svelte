<script>
	// external components
	import { RSA, Crypt } from 'hybrid-crypto-js';
	import { push } from 'svelte-spa-router'
	import axios from 'axios'

	// internal components
	import appConfig from '@@Config/app';
	import GoBack from '@@Components/GoBack.svelte';
	import Submit from '@@Components/Submit.svelte';
	import Info from '@@Components/Info.svelte';
	import { citizen } from "@@Stores/citizen.js";
	import { users } from "@@Stores/users.js";

	const username = $users.loggedInUser;
	const wallet = $users.users.filter(u => u.username === username)[0].wallet;
	const keypair = $users.users.filter(u => u.username === username)[0].keypair;
	const id = $users.users.filter(u => u.username === username)[0].id;

	var rsa = new RSA();
	var crypt = new Crypt();
	$: infoType = '';
	$: infoValue = '';

	const generateKeyPair = () => {
		return new Promise((resolve) => {
			rsa.generateKeyPair(resolve);
		})
	}
	
	const createIdentity = async (e) => {
		e.preventDefault();

		// create keypair (to be shared later)
		const keypairToShare = await generateKeyPair();

		// encrypt the identity with the publicKey
		const encryptedIdentity = crypt.encrypt(keypairToShare.publicKey, JSON.stringify($citizen));
		
		// post the identity to the nerves
		const resIdentity = await axios
			.post(appConfig.nerves.identity.url, {
				encryptedIdentity,
				user: {username, wallet}
			})
			.catch(e => {
				infoType = 'error';
				infoValue = e.message
			})

		if (!resIdentity) return;

		infoType = 'info';
		infoValue = resIdentity.data.message;
		
		// create verification jobs
		const resJob = await axios
			.post(appConfig.nerves.job.url, {
				type: 'confirmation',
				data: encryptedIdentity,
				chaincode: 'identity',
				key: id,
				user: {username, wallet}
			})
			.catch(e => {
				infoType = 'error';
				infoValue = e.message
			})

		if (!resJob) return;

		infoType = 'info';
		infoValue = resJob.data.message;

		const { workersIds, jobId } = resJob.data;

		// share the keypair with the workers
		const myEncryptedKeyPair = crypt.encrypt(keypair.publicKey, keypairToShare);
		const sharedWith = workersIds.reduce((acc, worker) => {
			return {
				...acc,
				[worker._id]: {keyPair: crypt.encrypt(worker.publicKey, keypairToShare)}
			}
		}, {});

		const resKeypair = await axios
			.post(appConfig.nerves.user.keypair.url, {
				sharedWith,
				groupId: jobId,
				myEncryptedKeyPair,
				type: 'job',
				user: {username, wallet}
			})
			.catch(e => {
				infoType = 'error';
				infoValue = e.message
			})

		if (!resKeypair) return;

		infoType = 'info';
		infoValue = 'Your identity have been successfully created. Wait for confirmations.';
		$users.users.filter(u => u.username === username)[0].identity = {...$citizen};
	}
</script>

<h1>Get Verified</h1>

<form class="content">
	<Info type={infoType} value={infoValue} />
	<input type="text" bind:value={$citizen.firstname} placeholder="Firstname" />
	<input type="text" bind:value={$citizen.lastname} placeholder="Lastname" />
	<input type="text" bind:value={$citizen.nation} placeholder="Nation" />
	<input type="text" bind:value={$citizen.nationalId} placeholder="Nation ID" />
	<Submit onclick={createIdentity} />
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
