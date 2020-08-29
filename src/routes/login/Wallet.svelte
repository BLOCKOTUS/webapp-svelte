<script>
	// external components
	
	// internal components
	import appConfig from '@@Config/app';
    import GoBack from '@@Components/GoBack.svelte';
    import Header from '@@Components/Header.svelte';
	import { users } from "@@Stores/users.js";

</script>

<Header title="Login" />
<form class="content">
    <div class="left-content">
        <label for="wallet" value="Wallet">Wallet</label>
        <textarea type="text" bind:value={$users.tmp.wallet} name="wallet" placeholder="Copy-paste your wallet here."/>
    </div>
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

    .left-content {
        text-align: left;
        width: 42vw;
    }

    .left-content textarea {
        width: 100%;
    }
    
</style>