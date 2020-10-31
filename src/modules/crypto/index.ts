import { RSA } from 'hybrid-crypto-js';
import md5 from 'md5';

import type { Keypair } from '@@Modules/user';
import type { IdentityType } from '@@Modules/identity';

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

export const uniqueHashFromIdentity = (identity: IdentityType): string =>
    md5(`${identity.nation}-${identity.nationalId}-${identity.birthdate}`);
