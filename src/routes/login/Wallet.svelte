<script>
	// external components
	
	// internal components
    import appConfig from '@@Config/app';
    import GoBack from '@@Components/GoBack.svelte';
    import Header from '@@Components/Header.svelte';
    import Submit from '@@Components/Submit.svelte';
    import Info from '@@Components/Info.svelte';
    import { users } from "@@Stores/users.js";

    $: infoValue = '';
    $: infoType = '';
    
    $: submitIsDisabled = 
        $users.tmp.username.length === 0
        || $users.tmp.keypair.length === 0
        || $users.tmp.wallet.length === 0
    
    const login = (e) => {
        e.preventDefault();

        if ($users
            .users
            .filter(u => u.username === $users.tmp.username)
            .length > 0) {
                infoValue = `${$users.tmp.username} already logged in.`;
                infoType = 'error';
                return;
            }
        
        const newUsers = [...$users.users, {... $users.tmp}];
        $users.users = newUsers;
        $users.tmp.wallet = '';
        $users.tmp.keypair = '';
        $users.tmp.username = '';

        infoValue = 'Successfully registered.';
        infoType = 'info';

        return;
    }

    

</script>

<Header title="Login" />
<form class="content">
    <Info type={infoType} value={infoValue} />
    <div class="left-content">
        <input type="text" placeholder="Username" name="username" bind:value={$users.tmp.username} />
        <textarea type="text" bind:value={$users.tmp.wallet} name="wallet" placeholder="Copy-paste your wallet here."/>
        <textarea type="text" bind:value={$users.tmp.keypair} name="keypair" placeholder="Copy-paste your keypair here."/>
    </div>
	<Submit onclick={login} disabled={submitIsDisabled} />
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
