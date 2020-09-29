import type { AxiosResponse } from 'axios';

import type { RequestReponseObject } from '@@Modules/nerves';

export type Keypair = {
    publicKey: string,
    privateKey: string,
} 

export type Account = {
    id: string, 
    username: string,
}

export type User = {
    username: string,
    wallet: string,
    keypair: Keypair,
}

type UserKeypairResponseObject = { 
    keypair: Keypair;
};

export type RequestUserKeypairResponseObject = RequestReponseObject & UserKeypairResponseObject;

export type RequestUserResponse = AxiosResponse<RequestUserKeypairResponseObject>;
