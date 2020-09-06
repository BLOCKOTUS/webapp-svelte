<script>
	// external components
	import { Crypt } from 'hybrid-crypto-js';

	// internal components
    import appConfig from '@@Config/app';
    import GoBack from '@@Components/GoBack.svelte';
    import Header from '@@Components/Header.svelte';
    import Submit from '@@Components/Submit.svelte';
    import Info from '@@Components/Info.svelte';
    import { users } from "@@Stores/users.js";

    const crypt = new Crypt();

    $: infoValue = '';
    $: infoType = '';
    
    $: submitIsDisabled = 
        $users.tmp.username.length === 0
        || $users.tmp.keypair.length === 0
        || $users.tmp.wallet.length === 0
    

    const validateKeypair = (keypair) => {
        return new Promise((resolve, reject) => {
            if(!keypair.privateKey || !keypair.publicKey) {
                reject();
                return;
            }
            const message = 'testme';
            const encrypted = crypt.encrypt(keypair.publicKey, message);
            const decrypted = crypt.decrypt(keypair.privateKey, encrypted);
            decrypted.message === message ? resolve() : reject();
            return;
        })
    }

    const login = (e) => {
        e.preventDefault();

        validateKeypair($users.tmp.keypair)
            .catch(e => {
                infoValue = `Keypair is invalid.`;
                infoType = 'error';
                return;
            });

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
        $users.tmp.keypair = {};
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
        <textarea type="text" bind:value={$users.tmp.keypair.publicKey} name="publicKey" placeholder="Copy-paste your publicKey here."/>
        <textarea type="text" bind:value={$users.tmp.keypair.privateKey} name="privateKey" placeholder="Copy-paste your privateKey here."/>
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
