import { writable } from 'svelte/store';

export const citizen = writable({
  firstname: "",
  lastname: "",
  nation: "",
  nationalId: "",
  birthdate: "",
  documentation: "",
});
