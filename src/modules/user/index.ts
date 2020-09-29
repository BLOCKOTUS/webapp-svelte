import type { AxiosResponse } from 'axios';

import type { RequestReponseObject } from '@@Modules/nerves';
import type { Encrypted } from '@@Modules/crypto';
import type { IdentityType } from '@@Modules/identity';

export type Keypair = {
    publicKey: string;
    privateKey: string;
} 

export type Account = {
    id: string;
    username: string;
}

export type User = Account & {
    wallet: string;
    keypair: Keypair;
    identity?: IdentityType;
}

type UserKeypairResponseObject = { 
    keypair: Encrypted;
};

export type SharedWithKeypair = Record<string, string>;

export type RequestUserKeypairResponseObject = RequestReponseObject & UserKeypairResponseObject;

export type RequestUserResponse = AxiosResponse<RequestUserKeypairResponseObject>;
