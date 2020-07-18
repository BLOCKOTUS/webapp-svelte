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

	// unused for the PoC, but necessary for the RC 
	// var rsa = new RSA();
	var crypt = new Crypt();
	
	// unused for the PoC, but necessary for the RC 
	// rsa.generateKeyPairAsync().then(keyPair => keypair = keyPair);

	const onClick = (e) => {
		e.preventDefault();
		var verificator = jobs.getVerificator(0); // verificator is an object representation of a verified user, containing a publicKey and a submnit() function
		var encryptedData = crypt.encrypt(verificator.publicKey, JSON.stringify($citizen)); // encryptedData is the encrypted data of the Citizen, filled in the form below
		verificator.submit(encryptedData); // finally, we use the submit function (yet to be define) that will push the data as a new task in the Job bank, assigned to the verificator above
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
	padding-bottom: 3vw;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
  }
</style>
