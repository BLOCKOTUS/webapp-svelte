import type { AxiosResponse } from 'axios';
import { Crypt } from 'hybrid-crypto-js';

import appConfig from '@@Config/app';
import { request } from '@@Modules/nerves';
import { generateKeyPair, uniqueHashFromIdentity } from '@@Modules/crypto';
import { makeInfoProps } from '@@Modules/info';

import type { InfoType } from '@@Modules/info';
import type { RequestReponseObject } from '@@Modules/nerves';
import type { User } from '@@Modules/user';
import type { SharedWithKeypair } from '@@Modules/user';
import type { WorkerType } from '@@Modules/job';

const crypt = new Crypt();

export type Confirmations = [ number, number ];

export type KYC = boolean;

export type IdentityType = {
    firstname: string;
    lastname: string;
    nation: string;
    nationalId: string;
    birthdate: string;
    documentation: string;
}

type EncryptedIndentity = Record<string, unknown>;

export type IdentityResponseObject = { 
    encryptedIdentity: EncryptedIndentity;
    confirmations: Confirmations;
    kyc: KYC;
};

export type RequestIdentityResponseObject = RequestReponseObject & { 
    identity: IdentityResponseObject;
};

export type RequestIdentityResponse = AxiosResponse<RequestIdentityResponseObject>;

export const verifyDocumentationUrl = (url: string): boolean => {
    const regex = /^https?:\/\/imgur.com\/a\/([\w]{7})$/gm;
    return regex.test(url);
};

export const createIdentity = async (
    citizen: IdentityType, 
    user: User,
    setInfo: (info: InfoType) => void,
): Promise<InfoType> => {

    let info = makeInfoProps('info', 'Submitting...', true);
    setInfo(info);

    if (!verifyDocumentationUrl(citizen.documentation)) {
        info = makeInfoProps('error', 'Documentation URL is incorrect. Format: https://imgur.com/a/5a15vOr', false);
        setInfo(info);
        return info;
    }

    // create keypair (to be shared later)
    const keypairToShare = await generateKeyPair();

    // encrypt the identity with the publicKey
    const encryptedIdentity = crypt.encrypt(keypairToShare.publicKey, JSON.stringify(citizen));
    
    // post the identity to the nerves
    const resIdentity = await request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.identity.url,
        method: 'POST',
        data: {
            encryptedIdentity,
            uniqueHash: uniqueHashFromIdentity(citizen),
        },
    })
    .catch(e => {
        info = makeInfoProps('error', e.message, false);
    });
    
    if (!resIdentity) return info;
    if (!resIdentity.data.success) {
        info = makeInfoProps('error', resIdentity.data.message, false);
        setInfo(info);
        return info;
    }

    info = makeInfoProps('info', resIdentity.data.message, true);
    setInfo(info);
    
    // create verification jobs
    const resJob = await request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.job.url,
        method: 'POST',
        data: {
            type: 'confirmation',
            data: encryptedIdentity,
            chaincode: 'identity',
            key: user.id,
        },
    })
    .catch(e => {
        info = makeInfoProps('error', e.message, false);
        setInfo(info);
    });

    if (!resJob) return info;
    if (!resJob.data.success) {
        info = makeInfoProps('error', resJob.data.message, false);
        setInfo(info);
        return info;
    }

    info = makeInfoProps('info', resJob.data.message, true);
    setInfo(info);

    const { workersIds, jobId } = resJob.data;

    // share the keypair with the workers
    const myEncryptedKeyPair = crypt.encrypt(user.keypair.publicKey, JSON.stringify(keypairToShare));
    const sharedWith = workersIds.reduce(
        (acc: SharedWithKeypair, worker: WorkerType) => {
            return ({
                ...acc,
                [worker._id]: {keypair: crypt.encrypt(worker.publicKey, JSON.stringify(keypairToShare))},
            });
        },
        {},
    );

    const resKeypair = await request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.user.keypair.url,
        method: 'POST',
        data: {
            sharedWith,
            groupId: jobId,
            myEncryptedKeyPair,
            type: 'job',
        },
    })
    .catch(e => {
        info = makeInfoProps('error', e.message, false);
        setInfo(info);
    });

    if (!resKeypair) return info;
    if (!resKeypair.data.success) {
        info = makeInfoProps('error', resKeypair.data.message, false);
        setInfo(info);
        return info;
    }

    info = makeInfoProps('info', 'Your identity have been successfully created. Wait for confirmations. You will be redirected.', false);
    setInfo(info);
    return info;
};
