<script>
	// external components
	import { push } from 'svelte-spa-router';
	import { Crypt } from 'hybrid-crypto-js';

	// internal components
	import GoBack from '@@Components/GoBack.svelte';
	import Button from '@@Components/Button.svelte';
	import Approve from '@@Components/Approve.svelte';
	import Refuse from '@@Components/Refuse.svelte';

	// modules
	import * as job from '@@Modules/job';

	// props attached when starting a job
	export let params = {}

	const onClickVerify = i => push(`/kyc/verify/${i}`);

	// mock
	const onClickApprove = i => console.log(`Approve ${i}`); // must communiacte with the Job module and the Identity Module
	const onClickRefuse = i => console.log(`Refuse ${i}`); // must communiacte with the Job module
	
	var crypt = new Crypt();
	// var verificator = user;
	const decryptedJob = params.jobId !== null ? crypt.decrypt(verificator.privateKey, job.get(params.jobId).data) : null
	const decryptedObject = decryptedJob !== null ? JSON.parse(decryptedJob.message) : {};
</script>

<div>
{#if params.jobId === null}
	<table>
		{#each Object.keys(job.getList()) as jobId, i}
			<tr>
				<td>{job.get(jobId).id}</td>
				<td>{job.get(jobId).status}</td>
				<td><Button label="verify" onclick={() => onClickVerify(jobId)}></Button></td>
			</tr>
		{/each}
	</table>
{:else}
	<div>
		<h3>Job #{params.jobId}</h3>
		<table>
			<tr><td>Firstname</td><td>{decryptedObject.firstname}</td></tr>
			<tr><td>Surname</td><td>{decryptedObject.surname}</td></tr>
			<tr><td>Lastname</td><td>{decryptedObject.lastname}</td></tr>
			<tr><td>Nation</td><td>{decryptedObject.nation}</td></tr>
			<tr><td>National Id</td><td>{decryptedObject.nationalId}</td></tr>
			<tr><td>Birthdate</td><td>{decryptedObject.birthdate}</td></tr>
			<tr><td>Address</td><td>{JSON.stringify(decryptedObject.address)}</td></tr>
		</table>
		<div>Documentation 1</div>
		<div>Documentation 2</div>
	</div>
	<div class="refuse_approve_button">
		<Approve label="Approve" onclick={() => onClickApprove(params.jobId)}></Approve>
		<Refuse label="Refuse" onclick={() => onClickRefuse(params.jobId)}></Refuse>
	</div>
{/if}
<GoBack />
</div>
    
<style>
	* {
		box-sizing: border-box;
	}
	
	.refuse_approve_button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 50px;
	}

	table {
		border-spacing: 0px;
		border-collapse: collapse;
		width: 100%;
		max-width: 100%;
		margin-bottom: 15px;
		background-color: transparent; /* Change the background-color of table here */
		text-align: left; /* Change the text-alignment of table here */
	}
	
	th {
		font-weight: bold;
		border: 1px solid #cccccc; /* Change the border-color of heading here */
		padding: 8px;
	}
	
	td {
		border: 1px solid #cccccc; /* Change the border-color of cells here */
		padding: 8px;
	}
	
	/* Stylized */
	
	/* Adding Striped Effect for odd rows */
	
	tr {
		background-color: transparent; /* Change the default background-color of rows here */
	}
	
	tr:nth-of-type(2n+1) {
		background-color: #eeeeee; /* Change the background-color of odd rows here */
	}
	
	tr th {
		background-color: #dddddd; /* Change the background-color of heading here */
	}
	
	/* Adding Hover Effect for rows */
	
	tr {
		-moz-transition: background-color 300ms ease-in-out 0s;
		-ms-transition: background-color 300ms ease-in-out 0s;
		-o-transition: background-color 300ms ease-in-out 0s;
		-webkit-transition: background-color 300ms ease-in-out 0s;
		transition: background-color 300ms ease-in-out 0s;
	}
	
	tr:hover {
		background-color: #ffb299; /* Change the hover background-color of rows here */
	}
	
	/* Removing left and right border of rows for modern UIs */
	
	tr {
		border-top: 1px solid #cccccc;
		border-bottom: 1px solid #cccccc;
	}
	
	th, td {
		border: none;
	}
</style>