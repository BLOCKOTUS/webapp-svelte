<script lang="typescript">
    import { users } from "@@Stores/users";

    export let title: string;

    const _onchange = (e: {target: { value: string }}) => $users.loggedInUser = e.target.value.length > 0 ? e.target.value : null;

</script>

<select class="login-dropdown" on:blur={e => _onchange(e)}>
    <option value="" selected={$users.loggedInUser === null}>Not logged in</option>
    {#each $users.users as user}
        <option value={user.username} selected={$users.loggedInUser === user.username}>{user.username}</option>
    {/each}
</select>
<h1>{title}</h1>

<style>

</style>
