import { RSA } from 'hybrid-crypto-js';
import md5 from 'md5';
import { Crypt } from 'hybrid-crypto-js';

import type { IdentityType, IdentityTypeWithKYC } from '@@Modules/identity';

export type Encrypted = string;

export type Decrypted = {
    message: string;
    signature: string;
};

export type Keypair = {
    publicKey: string;
    privateKey: string;
};

const crypt = new Crypt();

export const generateKeyPair = (): Promise<Keypair> => {
	const rsa = new RSA();
    return new Promise((resolve) => {
        rsa.generateKeyPair(resolve);
    });
};

export const uniqueHashFromIdentity = (identity: IdentityType | IdentityTypeWithKYC): string =>
    md5(`${identity.nation}-${identity.nationalId}-${identity.birthdate}`);

export const validateKeypair = async (keypair: Keypair): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if(!keypair.privateKey || !keypair.publicKey) {
            reject(false);
            return;
        }
        const message = 'testme';
        const encrypted = crypt.encrypt(keypair.publicKey, message);
        const decrypted = crypt.decrypt(keypair.privateKey, encrypted);
        decrypted.message === message ? resolve(true) : reject(false);
        return;
    });
};