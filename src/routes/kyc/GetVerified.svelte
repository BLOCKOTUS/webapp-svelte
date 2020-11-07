<script lang="typescript">
	import { push } from 'svelte-spa-router';
	import MaskInput from "svelte-input-mask/MaskInput.svelte";

	import GoBack from '@@Components/GoBack.svelte';
	import Submit from '@@Components/Submit.svelte';
	import Info from '@@Components/Info.svelte';
	import Header from '@@Components/Header.svelte';
	import { citizen } from "@@Stores/citizen";
	import { users } from "@@Stores/users";
	import { submitCreateIdentity, submitCreateIdentityIsDisabled } from '@@Modules/identity';
	import { getLoggedInUser } from '@@Modules/user';
	import type { InfoType } from '@@Modules/info';

	const maskString = 'YYYY-MM-DD';
	const mask = '0000-00-00';
	const user = getLoggedInUser($users);

	let info: InfoType;
	$: info = { value: '', type: '', loading: false };
	const onInfo = (i: InfoType) => info = i;
	const onComplete = () => setTimeout(() => push('/'), 3000);

	$: submitIsDisabled = submitCreateIdentityIsDisabled($citizen);
</script>

<Header title="Get verified" />

<form>
	<Info info={info} />
	<input type="text" bind:value={$citizen.firstname} placeholder="Firstname" />
	<input type="text" bind:value={$citizen.lastname} placeholder="Lastname" />
	<MaskInput {maskString} {mask} on:change={e => $citizen.birthdate = e.detail.inputState.maskedValue} placeholder="Birthdate YYYY-MM-DD" />
	<input type="text" bind:value={$citizen.nation} placeholder="Nation" />
	<input type="text" bind:value={$citizen.nationalId} placeholder="National ID" />
	<input type="text" bind:value={$citizen.documentation} placeholder="Documentation" />
	Copy-paste the url of your imgur gallery in the documentation field. 
	<br /> <a href="https://imgur.com/a/5a15vOr" target="_blank">https://imgur.com/a/5a15vOr</a>
	<Submit onclick={e => submitCreateIdentity({ e, user, users: $users, citizen: $citizen, onInfo, onComplete })} disabled={submitIsDisabled} />
</form>

<GoBack />

<style>
	form {
		padding-bottom: 3vw;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>

