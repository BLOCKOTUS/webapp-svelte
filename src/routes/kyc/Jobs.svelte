<script>
	// external components
	import { push } from 'svelte-spa-router';
	import { Crypt } from 'hybrid-crypto-js';
	import axios from 'axios';

	// internal components
	import appConfig from '@@Config/app';
	import GoHome from '@@Components/GoHome.svelte';
	import Button from '@@Components/Button.svelte';
	import Approve from '@@Components/Approve.svelte';
	import Refuse from '@@Components/Refuse.svelte';
	import Info from '@@Components/Info.svelte';
	import Header from '@@Components/Header.svelte';
	import { users } from "@@Stores/users.js";
	import { request } from '@@Modules/nerves'

	const username = $users.loggedInUser;
	const wallet = $users.users.filter(u => u.username === username)[0].wallet;
	const keypair = $users.users.filter(u => u.username === username)[0].keypair;
	const id = $users.users.filter(u => u.username === username)[0].id;

	$: list = [];
	$: infoType = '';
	$: infoValue = '';
	$: infoLoading = true;

	const onClickVerify = i => push(`/kyc/verify/${i}`);

	request({
		username,
		wallet,
		url: appConfig.nerves.job.list.url,
		method: 'GET',
		params: {
			status: 'pending',
		}
	})
		.catch(e => {
			infoType = 'error';
			infoValue = e.message;
			infoLoading = false;
		})
		.then(resList =>{
			if (resList) {
				list = resList.data.list;
				localStorage.setItem('job.list.pending', JSON.stringify(list));
				if (list.length === 0) infoValue = 'You have no jobs assigned.';
				infoLoading = false;
			}
		})

</script>

<Header title="Verify" />
<Info type={infoType} value={infoValue} loading={infoLoading} />

<table>
	<tr>
		<th>Job ID</th>
		<th>Status</th>
		<th>Action</th>
	</tr>
	{#each list as job, i}
		<tr>
			<td>{job.jobId}</td>
			<td>{job.status}</td>
			<td><Button label="verify" onclick={() => onClickVerify(i)}></Button></td>
		</tr>
	{/each}
</table>

<GoHome />

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
