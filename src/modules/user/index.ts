import type { AxiosResponse } from 'axios';
import { Crypt } from 'hybrid-crypto-js';

import appConfig from '@@Config/app';
import { request } from '@@Modules/nerves';
import type { RequestReponseObject } from '@@Modules/nerves';
import type { Encrypted, Keypair } from '@@Modules/crypto';
import type { IdentityType } from '@@Modules/identity';
import type { WorkerType } from '@@Modules/job';

export type Account = {
    id: string;
    username: string;
};

export type Wallet = {
    credentials: {
        certificate: string;
        privateKey: string;
    }
    mspId: string;
    type: string;
};

export type User = Account & {
    id: string;
    wallet: Wallet;
    keypair: Keypair;
    username: string;
    identity?: IdentityType;
};

export type UsersType = {
    loggedInUser: string;
    users: Array<User>;
    tmp: User;
};

type UserKeypairResponseObject = { 
    keypair: Encrypted;
};

export type SharedWithKeypair = Record<string, { keypair: Encrypted }>;

export type RequestUserKeypairResponseObject = RequestReponseObject & UserKeypairResponseObject;
export type RequestPostKeypairResponseObject = RequestReponseObject;

export type RequestUserKeypairResponse = AxiosResponse<RequestUserKeypairResponseObject>;
export type RequestPostKeypairResponse = AxiosResponse<RequestPostKeypairResponseObject>;

const crypt = new Crypt();

const makeSharedWithObjectForWorkers = (
    {
        workersIds,
        keypairToShare,
    }: {
        workersIds: Array<WorkerType>,
        keypairToShare: Keypair,
    },
): SharedWithKeypair => 
    workersIds.reduce(
        (acc: SharedWithKeypair, worker: WorkerType) => {
            return ({
                ...acc,
                [worker._id]: { keypair: JSON.stringify(crypt.encrypt(worker.publicKey, JSON.stringify(keypairToShare))) },
            });
        },
        {},
    );

export const getLoggedInUser = (users: UsersType): User => 
    users.users.filter(u => u.username === users.loggedInUser)[0];

export const getEncryptedKeypair = (
    {
        keypairId,
        user,
    }: {
        keypairId: string,
        user: User,
    },
): Promise<RequestUserKeypairResponse> => 
    request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.user.keypair.url,
        method: 'GET',
        params: {
            keypairId,
        },          
    });

export const postEncryptedKeypair = (
    {
        workersIds,
        keypairToShare,
        jobId,
        myEncryptedKeyPair,
        user,
    }: {
        workersIds: Array<WorkerType>,
        keypairToShare: Keypair,
        jobId: string,
        myEncryptedKeyPair: Encrypted,
        user: User,
    },
): Promise<RequestPostKeypairResponse> => 
    request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.user.keypair.url,
        method: 'POST',
        data: {
            sharedWith: makeSharedWithObjectForWorkers({ workersIds, keypairToShare }),
            groupId: jobId,
            myEncryptedKeyPair,
            type: 'job',
        },
    });

export const decryptKeypair = (
    {
        user,
        encryptedKeypair,
    }: {
        user: User,
        encryptedKeypair: Encrypted,
    },
): Keypair => {
    const rawSharedKeypair = crypt.decrypt(user.keypair.privateKey, encryptedKeypair);
    return JSON.parse(rawSharedKeypair.message);
};
