<script>
	// external components
	import { push } from 'svelte-spa-router';
	import { Crypt } from 'hybrid-crypto-js';
	import axios from 'axios';

	// internal components
	import appConfig from '@@Config/app';
	import GoBack from '@@Components/GoBack.svelte';
	import Button from '@@Components/Button.svelte';
	import Approve from '@@Components/Approve.svelte';
	import Refuse from '@@Components/Refuse.svelte';
	import Info from '@@Components/Info.svelte';
	import Header from '@@Components/Header.svelte';
	import { users } from "@@Stores/users.js";
import { get } from 'svelte/store';

	// props attached when starting a job
	export let params = {}

	const username = $users.loggedInUser;
	const wallet = $users.users.filter(u => u.username === username)[0].wallet;
	const keypair = $users.users.filter(u => u.username === username)[0].keypair;
	const id = $users.users.filter(u => u.username === username)[0].id;

	$: infoType = '';
	$: infoValue = '';

	// mock
	const onClickApproveRefuse = async (i, result) => {
		console.log(`Approve ${i}`);

		infoType = 'info';
		infoValue = 'Submiting result...';

		const resComplete = await axios.post(appConfig.nerves.job.complete.url, {
			jobId,
			result,
			user: {username, wallet}
		}).catch(e => {
			infoType = 'error';
			infoValue = resComplete.data.message || 'error'
			return;
		})

		if(!resComplete || !resComplete.data.success){
			infoType = 'error';
			infoValue = resComplete.data.message || 'error'
			return;
		}

		infoType = 'info';
		infoValue = 'Job complete. You will be redirected to the job list.';
		setTimeout(() => push('/kyc/jobs'), 1500);

	}

	const onClickRefuse = i => console.log(`Refuse ${i}`); // must communiacte with the Job module

	// get job id
	const rawJobList = localStorage.getItem('job.list.pending');
	const jobList = JSON.parse(rawJobList);
	const jobId = jobList[params.jobId].jobId;

	const getDecryptedJob = async () => {
		return new Promise(async (resolve, reject) => {
			// get job details
			const resJob = await axios
				.post(appConfig.nerves.job.get.url, {
					jobId,
					user: {username, wallet}
				})
			
			if(!resJob.data.job  || !resJob.data.success) {
				infoType = 'error';
				infoValue = resJob.data.message || 'error'
				reject(e);
				return;
			};

			const job = resJob.data.job;
			console.log({job})
			infoType = 'info';
			infoValue = resJob.data.message;
			
			// get shared keypairs
			const keypairId = `job||${job.creator}||${jobId}`;
			const resSharedKey =  await axios
				.post(appConfig.nerves.user.keypair.get.url, {
					keypairId,
					user: {username, wallet}
				})

			if( !resSharedKey || !resSharedKey.data.success) {
				infoType = 'error';
				infoValue = resSharedKey.data.message || 'error';
				reject(e);
				return;
			}

			infoType = 'info';
			infoValue = resSharedKey.data.message;

			console.log(keypair, resSharedKey.data.keypair);

			const crypt = new Crypt();

			const rawSharedKeypair = crypt.decrypt(keypair.privateKey, JSON.stringify(resSharedKey.data.keypair));
			console.log({rawSharedKeypair})

			const sharedKeypair = JSON.parse(rawSharedKeypair.message)
			console.log({sharedKeypair})

			const decryptedJob = crypt.decrypt(sharedKeypair.privateKey, job.data);
			console.log({decryptedJob})

			const message = JSON.parse(decryptedJob.message);
			console.log({message})
			resolve(message);
		})
	}

	let decryptedJobPromise = getDecryptedJob();

</script>

<Header title="Verify" />

<div>
	<Info type={infoType} value={infoValue} />
	{#await decryptedJobPromise }
	{:then decryptedJob }
		<div>
			<h3>Job #{jobId}</h3>
			<table>
				<tr><td>Firstname</td><td>{decryptedJob.firstname}</td></tr>
				<tr><td>Lastname</td><td>{decryptedJob.lastname}</td></tr>
				<tr><td>Nation</td><td>{decryptedJob.nation}</td></tr>
				<tr><td>National Id</td><td>{decryptedJob.nationalId}</td></tr>
			</table>
			<div>Documentation 1</div>
			<div>Documentation 2</div>
		</div>
		<div class="refuse_approve_button">
			<Approve label="Approve" onclick={() => onClickApproveRefuse(jobId, 1)}></Approve>
			<Refuse label="Refuse" onclick={() => onClickApproveRefuse(jobId, 0)}></Refuse>
		</div>
	{/await}
</div>

<GoBack />

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
		background-color: #e4f4d4; /* Change the hover background-color of rows here */
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