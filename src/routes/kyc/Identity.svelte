<script>
	// external components
	import { Crypt } from 'hybrid-crypto-js';

	// internal components
	import appConfig from '@@Config/app';
	import GoBack from '@@Components/GoBack.svelte';
	import Header from '@@Components/Header.svelte';
	import Identity from '@@Components/Identity.svelte';
	import Info from '@@Components/Info.svelte';
	import { users } from "@@Stores/users.js";
	import { request } from '@@Modules/nerves';

	$: infoType = 'info';
	$: infoValue = 'Loading your identity...';
	$: infoLoading = true;
	$: identity = false;
	$: resIdentity = {};

	const username = $users.loggedInUser;
	const wallet = $users.users.filter(u => u.username === username)[0].wallet;
	const keypair = $users.users.filter(u => u.username === username)[0].keypair;
	const id = $users.users.filter(u => u.username === username)[0].id;

	const crypt = new Crypt();

	request({
		username,
		wallet,
		url: appConfig.nerves.identity.url,
		method: 'GET',
	})
		.catch(e => {
			infoType = 'error';
			infoValue = e.message;
			infoLoading = false;
		})
		.then(async resId =>{
			if (resId) {
				if(!resId.data.success){
					infoType = 'error';
					infoValue = resId.data.message;
					infoLoading = false;
					return;
				}

				resIdentity = resId.data.identity;
				var encryptedIdentity = resIdentity.encryptedIdentity;

				// get job Id
				infoValue = 'Requesting the jobId used when creating your identity...';
				const resJobId = await request({
					username,
					wallet,
					url: appConfig.nerves.job.list.url,
					method: 'GET',
					params: {
						chaincode: 'identity',
						key: id,
					},
				});

				if( !resJobId || !resJobId.data.success) {
					infoType = 'error';
					infoValue = resJobId.data.message || 'error';
					infoLoading = false;
					return;
				}

				const jobId = resJobId.data.list[0].jobId;

				// get shared keypairs
				infoValue = 'Requesting the shared keypair used when creating your identity...';
				const keypairId = `job||${id}||${jobId}`;
				const resSharedKey = await request({
					username,
					wallet,
					url: appConfig.nerves.user.keypair.url,
					method: 'GET',
					params: {
						keypairId,
					},
				});

				if( !resSharedKey || !resSharedKey.data.success) {
					infoType = 'error';
					infoValue = resSharedKey.data.message || 'error';
					infoLoading = false;
					return;
				}

				const rawSharedKeypair = crypt.decrypt(keypair.privateKey, JSON.stringify(resSharedKey.data.keypair));
				const sharedKeypair = JSON.parse(rawSharedKeypair.message);

				var decryptedIdentity = crypt.decrypt(sharedKeypair.privateKey, encryptedIdentity);
				infoLoading = false;
				infoValue = '';

				identity = JSON.parse(decryptedIdentity.message);
			}
		});
</script>

<Header title="Identity" />
<Info type={infoType} value={infoValue} loading={infoLoading} />
{#if identity}
	<Identity 
		identity={identity}
		kyc={resIdentity.kyc}
		confirmations={resIdentity.confirmations}
	/>
{/if}

<GoBack />

<style>
	
</style>
