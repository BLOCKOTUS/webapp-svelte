import Login from '@@Routes/account/Login.svelte';
import Register from '@@Routes/account/Register.svelte';
import Manage from '@@Routes/account/Manage.svelte';

export default {
  '/account/login': Login,
  '/account/register': Register,
  '/account/manage': Manage,
};
