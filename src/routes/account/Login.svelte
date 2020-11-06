<script lang="typescript">

    import GoBack from '@@Components/GoBack.svelte';
    import Header from '@@Components/Header.svelte';
    import Submit from '@@Components/Submit.svelte';
    import Info from '@@Components/Info.svelte';
    import { users } from "@@Stores/users";
    import { login, submitLoginIsDisabled } from "@@Modules/login";
    import type { InfoType } from '@@Modules/info';

    let info: InfoType;
    $: info = { value: '', type: '', loading: false };
	const setInfo = (i: InfoType) => info = i;
    
    $: loginButtonIsDisabled = submitLoginIsDisabled($users);

    const setWallet = (e: {target: { value: string }}) => {
        try {
            $users.tmp.wallet = JSON.parse(e.target.value);
        } catch (e) { };
    };

</script>

<Header title="Login" />
<form class="content">
    <Info info={info} />
    <div class="left-content">
        <input type="text" placeholder="Username" name="username" bind:value={$users.tmp.username} />
        <textarea type="text" on:change={e => setWallet(e)} name="wallet" placeholder="Copy-paste your wallet here."/>
        <textarea type="text" bind:value={$users.tmp.keypair.publicKey} name="publicKey" placeholder="Copy-paste your publicKey here."/>
        <textarea type="text" bind:value={$users.tmp.keypair.privateKey} name="privateKey" placeholder="Copy-paste your privateKey here."/>
    </div>
	<Submit onclick={e => login({ e, users: $users, setInfo })} disabled={loginButtonIsDisabled} />
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
