<script>
	// external components
	import { Crypt, RSA } from 'hybrid-crypto-js';

	// internal components
	import GoBack from '../components/GoBack.svelte';
	import Submit from '../components/Submit.svelte';
	import * as jobs from '../modules/jobs';
	import * as keypairs from '../fixtures/keypairs';
	import { citizen } from "../stores/citizen.js";

	var keypair = keypairs.user1;

	// var rsa = new RSA();
	var crypt = new Crypt();

	// rsa.generateKeyPairAsync().then(keyPair => keypair = keyPair);

	const onClick = (e) => {
		e.preventDefault();
		var verificator = jobs.getVerificator();
		var citizenValue;
		citizen.subscribe(val => citizenValue = val);
		var encryptedData = crypt.encrypt(verificator.publicKey, JSON.stringify($citizen));
		verificator.submit(encryptedData);
	}
</script>

<h1>Get Verified</h1>

<form class="content">
  <input type="text" bind:value={$citizen.firstname} placeholder="Firstname" />
  <input type="text" bind:value={$citizen.surname} placeholder="Surname" />
  <input type="text" bind:value={$citizen.lastname} placeholder="Lastname" />
  <input type="text" bind:value={$citizen.nation} placeholder="Nation" />
  <input type="text" bind:value={$citizen.nationalId} placeholder="Nation ID" />
  <Submit onclick={onClick} disabled={(keypair.publicKey.length === 0)}/>
</form>

<GoBack />

<h4>Public key</h4>
{keypair.publicKey}

<h4>Private key</h4>
{keypair.privateKey}

<style>
  .content {
	padding-bottom: 4.2vw;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
  }
</style>
