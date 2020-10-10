import { writable } from 'svelte/store';

export const citizen = writable({
  firstname: "",
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
  documentation: "",
});
