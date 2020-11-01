<script lang="typescript">
	import GoBack from '@@Components/GoBack.svelte';
	import Header from '@@Components/Header.svelte';
	import Identity from '@@Components/Identity.svelte';
	import Info from '@@Components/Info.svelte';
	import { users } from "@@Stores/users";
	import { decryptIdentity, getIdentity } from '@@Modules/identity';
	import { getJobList, decryptJob } from '@@Modules/job';
	import { getEncryptedKeypair, getUser, decryptKeypair } from '@@Modules/user';
	import { makeInfoProps } from '@@Modules/info';
	import type { InfoType } from '@@Modules/info';
	import type { IdentityResponseObject, IdentityTypeWithKYC } from '@@Modules/identity';

	let info: InfoType;
    $: info = { value: 'Loading your identity...', type: 'info', loading: true };

	const setInfo = (i: InfoType) => info = i;

	const user = getUser($users);

	const getMyIdentity = async () => {
		const resIdentity = await getIdentity(user);
		if (!resIdentity || !resIdentity.data.success){
			setInfo(makeInfoProps('error', resIdentity.data.message || 'error', false));
		}
		const encryptedIdentity = resIdentity.data.identity.encryptedIdentity;

		const resJobList = await getJobList(user, 'identity', user.id);
		if (!resJobList || !resJobList.data.success){
			setInfo(makeInfoProps('error', resJobList.data.message || 'error', false));
		}
		const jobId = resJobList.data.list[0].jobId;
		const keypairId = `job||${user.id}||${jobId}`;

		const resEncryptedKeypair = await getEncryptedKeypair(keypairId, user);
		if (!resEncryptedKeypair || !resEncryptedKeypair.data.success){
			setInfo(makeInfoProps('error', resEncryptedKeypair.data.message || 'error', false));
		}
		const sharedKeypair = decryptKeypair(user, resEncryptedKeypair.data.keypair);
		const decryptedIdentity = decryptIdentity(sharedKeypair, encryptedIdentity);
		setInfo(makeInfoProps('info', '', false));

		const identityWithKyc: IdentityTypeWithKYC = { 
			...decryptedIdentity,
			kyc: resIdentity.data.identity.kyc,
			confirmations: resIdentity.data.identity.confirmations,
		};

		return identityWithKyc;
	}

	const getMyIdentityPromise = getMyIdentity();
</script>

<Header title="Identity" />
<Info info={info} />
{#await getMyIdentityPromise then getMyIdentityRes}
	<Identity 
		identity={getMyIdentityRes}
	/>
{/await}
<GoBack />

<style>
	
</style>
