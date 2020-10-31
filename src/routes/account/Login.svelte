<script lang="typescript">
	import { Crypt } from 'hybrid-crypto-js';

    import GoBack from '@@Components/GoBack.svelte';
    import Header from '@@Components/Header.svelte';
    import Submit from '@@Components/Submit.svelte';
    import Info from '@@Components/Info.svelte';
    import { users } from "@@Stores/users";

    import type { User, Keypair } from '@@Modules/user';
    import type { InfoType } from '@@Modules/info';

    const crypt = new Crypt();

    let info: InfoType;
    $: info = { value: '', type: '', loading: false };
    
    $: submitIsDisabled = 
        $users.tmp.username.length === 0
        || $users.tmp.keypair.privateKey.length === 0
        || $users.tmp.keypair.publicKey.length === 0
        || $users.tmp.wallet.length === 0;
    

    const validateKeypair = (keypair: Keypair) => {
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
        });
    };

    const login = (e: Event) => {
        e.preventDefault();

        validateKeypair($users.tmp.keypair)
            .catch(_e => {
                info.value = `Keypair is invalid.`;
                info.type = 'error';
                return;
            });

        if ($users
            .users
            .filter((u: User) => u.username === $users.tmp.username)
            .length > 0) {
                info.value = `${$users.tmp.username} already logged in.`;
                info.type = 'error';
                return;
            }
        
        const newUsers = [...$users.users, {... $users.tmp}];
        $users.users = newUsers;
        $users.tmp.wallet = '';
        $users.tmp.keypair = { publicKey: '', privateKey: '' };
        $users.tmp.username = '';

        info.value = 'Successfully registered.';
        info.type = 'info';

        return;
    };

</script>

<Header title="Login" />
<form class="content">
    <Info info={info} />
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
