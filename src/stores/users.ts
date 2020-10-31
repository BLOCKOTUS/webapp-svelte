import { writable, Writable } from 'svelte/store';

import type { UsersType } from '@@Modules/user';

const localUsers = localStorage.getItem("store.users");

const setupUsers: UsersType = {
    loggedInUser: null,
    users: [],
    tmp: {
      id: '',
      wallet: '',
      keypair: {
        privateKey: '',
        publicKey: '',
      },
      username: '',
    },
  };

const defaultUsers = localUsers 
  ? JSON.parse(localUsers)
  : setupUsers;

export const users: Writable<UsersType> = writable(defaultUsers);

users.subscribe(val => localStorage.setItem("store.users", JSON.stringify(val)));
