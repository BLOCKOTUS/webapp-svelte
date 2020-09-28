import { writable, Writable } from 'svelte/store';

import type { User } from '@@Modules/user';

type UsersType = {
  loggedInUser: string,
  users: Array<User>,
  tmp: User,
};

const localUsers = localStorage.getItem("store.users");

const setupUsers: UsersType = {
    loggedInUser: null,
    users: [],
    tmp: {
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
