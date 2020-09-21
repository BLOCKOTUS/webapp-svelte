<script>
	export let identity;
	export let kyc;
	export let confirmations;
</script>

<table>
    <tr><td>Firstname</td><td>{identity.firstname}</td></tr>
    <tr><td>Lastname</td><td>{identity.lastname}</td></tr>
    <tr><td>Nation</td><td>{identity.nation}</td></tr>
    <tr><td>National Id</td><td>{identity.nationalId}</td></tr>
    <tr><td>KYC</td><td>{kyc}</td></tr>
    <tr><td>Confirmations</td><td>{confirmations[0]}/{confirmations[1]}</td></tr>
</table>
<div>Documentation 1</div>
<div>Documentation 2</div>

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
