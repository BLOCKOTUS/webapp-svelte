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
    id: string;
    wallet: string;
    keypair: Keypair;
    username: string;
    identity?: IdentityType;
}

export type UsersType = {
    loggedInUser: string,
    users: Array<User>,
    tmp: User,
  };

type UserKeypairResponseObject = { 
    keypair: Encrypted;
};

export type SharedWithKeypair = Record<string, string>;

export type RequestUserKeypairResponseObject = RequestReponseObject & UserKeypairResponseObject;

export type RequestUserResponse = AxiosResponse<RequestUserKeypairResponseObject>;

export const getUser = (users: UsersType): User => {
    const user: User = { id: '', username: '', wallet: '', keypair: { privateKey: '', publicKey: '' } };
    user.username = users.loggedInUser;
    user.wallet = users.users.filter(u => u.username === user.username)[0].wallet;
    user.keypair = users.users.filter(u => u.username === user.username)[0].keypair;
    user.id = users.users.filter(u => u.username === user.username)[0].id;
    return user;
};
