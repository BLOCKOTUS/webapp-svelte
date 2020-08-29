<script>
	// external components
	import { Crypt } from 'hybrid-crypto-js';
	import { push } from 'svelte-spa-router'

	// internal components
	import GoBack from '@@Components/GoBack.svelte';
	import Submit from '@@Components/Submit.svelte';
	import * as job from '@@Modules/job';
	import * as identity from '@@Modules/identity';
	import { citizen } from "@@Stores/citizen.js";

	var crypt = new Crypt();
	
	const onClick = async (e) => {
		e.preventDefault();
		
		var verificator = 
			await identity
				.getVerificator()
				.catch(console.log);
		
		if(!verificator) return;

		var encryptedData = crypt.encrypt(verificator.publicKey, JSON.stringify($citizen));

		job
			.submit({
				assignee: verificator.id,
				encryptedData,
			})
			.then(() => push('/kyc/success'))
			.catch(console.log) 
	}
</script>

<h1>Get Verified</h1>

<form class="content">
  <input type="text" bind:value={$citizen.firstname} placeholder="Firstname" />
  <input type="text" bind:value={$citizen.surname} placeholder="Surname" />
  <input type="text" bind:value={$citizen.lastname} placeholder="Lastname" />
  <input type="text" bind:value={$citizen.nation} placeholder="Nation" />
  <input type="text" bind:value={$citizen.nationalId} placeholder="Nation ID" />
  <Submit onclick={onClick} />
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
