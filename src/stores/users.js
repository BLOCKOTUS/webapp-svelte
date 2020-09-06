import { writable } from 'svelte/store';

const localUsers = localStorage.getItem("store.users");

const setupUsers = 
{
  loggedInUser: null,
  users: [],
  tmp: {
    wallet: '',
    keypair: {},
    username: ''
  }
}

const defaultUsers = localUsers 
  ? JSON.parse(localUsers)
  : setupUsers;

export const users = writable(defaultUsers)

users.subscribe(val => localStorage.setItem("store.users", JSON.stringify(val)));
