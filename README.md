# sbApp: KYC

![preview](https://github.com/sovereignblock/app_kyc/blob/master/README_img_1.png)
------
![preview](https://github.com/sovereignblock/app_kyc/blob/master/README_img_2.png)

## App Flow

### Get verified

1. User 1 fill the form
2. A key pair is created for user 1 (key pair 1)
4. User 2 (a verified Sovereign Id) is selected from the `jobs` organ 
4. Raw data is encrypted with the public key of user 2
3. Data is pushed to the `jobs data-pool`

### Verify

1. User 2 get encrypted data from the `jobs data-pool` of his pending `jobs`
2. Data is decrypted using user 2 private key
3. User 2 does his KYC job verification
4. If he approves, a key pair is created (key pair 3)
5. Raw data is encrypted with the public key pair 3 (encrypted data 3)
6. `private key 3` is encrypted using `public key 1` (encrypted key 3)
7. Identity is created, with encrypted data 3 + encrypted key 3, and associated with user 1

### Claim identity

1. User 1 connect with his private key
2. User 1 receives the `encrypted key 3` from the `jobs data-pool`
3. User 1 decrypt `private key 3` and verify the integrity of the identity
4. User 1 validate the ownership of the identity

## Getting started

```bash
$ npm run dev
```

## How to contribute

- Learn about Svelte.dev
- Fork and submit a pull-request