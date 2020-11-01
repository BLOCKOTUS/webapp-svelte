<script lang="typescript">
	import { push } from 'svelte-spa-router';

	import GoHome from '@@Components/GoHome.svelte';
	import Button from '@@Components/Button.svelte';
	import Info from '@@Components/Info.svelte';
	import Header from '@@Components/Header.svelte';
	import { users } from "@@Stores/users";
	import { getUser } from '@@Modules/user';
	import { getJobList } from '@@Modules/job';
	import { makeInfoProps } from '@@Modules/info';
    import type { InfoType } from '@@Modules/info';

	$: list = [];
	let info: InfoType;
    $: info = { value: 'Loading job list...', type: 'info', loading: true };
	const setInfo = (i: InfoType) => info = i;
	const user = getUser($users);

	const onClickVerify = (i: number) => push(`/kyc/verify/${i}`);

	const loadJobList = async () => {
		const resJobList = await getJobList({user, status: 'pending'});
		if (!resJobList || !resJobList.data.success) {
			setInfo(makeInfoProps('error', resJobList.data.message || 'error', false));
			return;
		}

		list = resJobList.data.list;
		localStorage.setItem('job.list.pending', JSON.stringify(list));
		if (list.length === 0) setInfo(makeInfoProps('info', 'You have no job assigned.', false));
		else setInfo(makeInfoProps('info', '', false));
	};

	loadJobList();
</script>

<Header title="Verification jobs" />
<Info info={info} />

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
