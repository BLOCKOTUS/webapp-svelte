<script lang="typescript">
	// external components
	import { Crypt } from 'hybrid-crypto-js';

	// internal components
	import appConfig from '@@Config/app';
	import GoBack from '@@Components/GoBack.svelte';
	import Header from '@@Components/Header.svelte';
	import Identity from '@@Components/Identity.svelte';
	import Info from '@@Components/Info.svelte';
	import { users } from "@@Stores/users";
	import { request } from '@@Modules/nerves';

	import type { InfoType } from '@@Modules/info';
	import type { IdentityResponseObject, IdentityTypeWithKYC } from '@@Modules/identity';

	let info: InfoType;
    $: info = { value: 'Loading your identity...', type: 'info', loading: true };

	let identityWithKyc: IdentityTypeWithKYC;
	$: identityWithKyc = null;
	let resIdentity: IdentityResponseObject;
	$: resIdentity = null;

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
			info.type = 'error';
			info.value = e.message;
			info.loading = false;
		})
		.then(async resId =>{
			if (resId) {
				if(!resId.data.success){
					info.type = 'error';
					info.value = resId.data.message;
					info.loading = false;
					return;
				}

				resIdentity = resId.data.identity;
				var encryptedIdentity = resIdentity.encryptedIdentity;
				
				// get job Id
				info.value = 'Requesting the jobId used when creating your identity...';
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
					info.type = 'error';
					info.value = resJobId.data.message || 'error';
					info.loading = false;
					return;
				}

				const jobId = resJobId.data.list[0].jobId;

				// get shared keypairs
				info.value = 'Requesting the shared keypair used when creating your identity...';
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
					info.type = 'error';
					info.value = resSharedKey.data.message || 'error';
					info.loading = false;
					return;
				}

				const rawSharedKeypair = crypt.decrypt(keypair.privateKey, JSON.stringify(resSharedKey.data.keypair));
				const sharedKeypair = JSON.parse(rawSharedKeypair.message);

				var decryptedIdentity = crypt.decrypt(sharedKeypair.privateKey, encryptedIdentity);
				info.loading = false;
				info.value = '';

				identityWithKyc = JSON.parse(decryptedIdentity.message);
				identityWithKyc.kyc = resIdentity.kyc;
				identityWithKyc.confirmations = resIdentity.confirmations;
			}
		});
</script>

<Header title="Identity" />
<Info info={info} />
{#if identityWithKyc}
	<Identity 
		identity={identityWithKyc}
	/>
{/if}

<GoBack />

<style>
	
</style>
