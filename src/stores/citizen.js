import { writable } from 'svelte/store';

export const citizen = writable({
  firstname: "",
  surname: "",
  lastname: "",
  nation: "",
  nationalId: "",
  birthdate: "",
  address: {
      line1: "",
      line2: "",
      postalCode: "",
      city: "",
      country: "",
  },
  documentation1: null,
  documentation2: null
})
