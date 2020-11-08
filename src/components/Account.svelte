<script lang="typescript">
	import { users } from '@@Stores/users';
	import type { User } from '@@Modules/user';

  export let account: User;

  const _delete = (username: string) => {
    const filteredUsers = $users.users.filter((u: User) => u.username !== username);
    $users.users = filteredUsers;
  };

</script>

<div class="account">
  <div class="delete">
    <span on:click={() => _delete(account.username)}>X</span>
  </div>
  <div class="infos">
    <span>{account.id}</span>
    <span>{account.username}</span>
  </div>
</div>
    
<style>
  .account {
    width: 600px;
    height: 100px;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #EDEAED;
  }

  .infos {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 550px;
  }

  .infos span {
    text-align: left;
  }

  .delete {
    width: 50px;
    text-align: center;
  }
</style>