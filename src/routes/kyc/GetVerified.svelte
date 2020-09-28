<script lang="typescript">
	// external components
	import { RSA, Crypt } from 'hybrid-crypto-js';
	import { push } from 'svelte-spa-router';
	import axios from 'axios';

	// internal components
	import appConfig from '@@Config/app';
	import GoBack from '@@Components/GoBack.svelte';
	import Submit from '@@Components/Submit.svelte';
	import Info from '@@Components/Info.svelte';
	import Header from '@@Components/Header.svelte';
	import { citizen } from "@@Stores/citizen";
	import { users } from "@@Stores/users";

	import type { InfoType } from '@@Components/Info';

	const username = $users.loggedInUser;
	const wallet = $users.users.filter(u => u.username === username)[0].wallet;
	const keypair = $users.users.filter(u => u.username === username)[0].keypair;
	const id = $users.users.filter(u => u.username === username)[0].id;

	var rsa = new RSA();
	var crypt = new Crypt();

	let info: InfoType;
    $: info = { value: '', type: '', loading: false };

	$: submitIsDisabled = 
		$citizen.firstname.length === 0
		|| $citizen.lastname.length === 0
		|| $citizen.nation.length === 0
		|| $citizen.nationalId.length === 0;

	const generateKeyPair = () => {
		return new Promise((resolve) => {
			rsa.generateKeyPair(resolve);
		});
	};
	
	const createIdentity = async (e) => {
		e.preventDefault();

		info.loading = true;

		// create keypair (to be shared later)
		const keypairToShare = await generateKeyPair();

		// encrypt the identity with the publicKey
		const encryptedIdentity = crypt.encrypt(keypairToShare.publicKey, JSON.stringify($citizen));
		
		// post the identity to the nerves
		const resIdentity = await axios
			.post(appConfig.nerves.identity.url, {
				encryptedIdentity,
				user: { username, wallet },
			})
			.catch(e => {
				info.type = 'error';
				info.value = e.message;
				info.loading = false;
			});
		
		if (!resIdentity || !resIdentity.data.success) {
			info.type = 'error';
			info.value = resIdentity.data.message;
			info.loading = false;
			return;
		}

		info.type = 'info';
		info.value = resIdentity.data.message;
		
		// create verification jobs
		const resJob = await axios
			.post(appConfig.nerves.job.url, {
				type: 'confirmation',
				data: encryptedIdentity,
				chaincode: 'identity',
				key: id,
				user: { username, wallet },
			})
			.catch(e => {
				info.type = 'error';
				info.value = e.message;
				info.loading = false;
			});

		if (!resJob || !resJob.data.success) {
			info.type = 'error';
			info.value = resJob.data.message;
			info.loading = false;
			return;
		}

		info.type = 'info';
		info.value = resJob.data.message;

		const { workersIds, jobId } = resJob.data;

		// share the keypair with the workers
		const myEncryptedKeyPair = crypt.encrypt(keypair.publicKey, JSON.stringify(keypairToShare));
		const decryptedKeypairRaw = crypt.decrypt(keypair.privateKey, myEncryptedKeyPair);
		const decryptedKeypair = JSON.parse(decryptedKeypairRaw.message);
		console.log({keypairToShare, myEncryptedKeyPair, decryptedKeypairRaw, decryptedKeypair});
		const sharedWith = workersIds.reduce(
      (acc, worker) => {
        return ({
          ...acc,
          [worker._id]: {keyPair: crypt.encrypt(worker.publicKey, JSON.stringify(keypairToShare))},
        });
      },
      {},
    );

		const resKeypair = await axios
			.post(appConfig.nerves.user.keypair.url, {
				sharedWith,
				groupId: jobId,
				myEncryptedKeyPair,
				type: 'job',
				user: { username, wallet },
			})
			.catch(e => {
				info.type = 'error';
				info.value = e.message;
				info.loading = false;
			});

		if (!resKeypair || !resKeypair.data.success) {
			info.type = 'error';
			info.value = resKeypair.data.message;
			info.loading = false;
			return;
		}

		$users.users.filter(u => u.username === username)[0].identity = {...$citizen};
		info.type = 'info';
		info.value = 'Your identity have been successfully created. Wait for confirmations. You will be redirected.';
		setTimeout(() => push('/'), 1500);
	};
</script>

<Header title="Get verified" />

<form class="content">
	<Info info={info} />
	<input type="text" bind:value={$citizen.firstname} placeholder="Firstname" />
	<input type="text" bind:value={$citizen.lastname} placeholder="Lastname" />
	<input type="text" bind:value={$citizen.nation} placeholder="Nation" />
	<input type="text" bind:value={$citizen.nationalId} placeholder="Nation ID" />
	<Submit onclick={createIdentity} disabled={submitIsDisabled} />
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
