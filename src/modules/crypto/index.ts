import { RSA } from 'hybrid-crypto-js';

import type { Keypair } from '@@Modules/user';

export type Encrypted = string;

export type Decrypted = {
    message: string;
    signature: string;
};

export const generateKeyPair = (): Promise<Keypair> => {
	const rsa = new RSA();
    return new Promise((resolve) => {
        rsa.generateKeyPair(resolve);
    });
};
