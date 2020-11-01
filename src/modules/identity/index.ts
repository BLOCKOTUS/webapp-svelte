import type { AxiosResponse } from 'axios';
import { Crypt } from 'hybrid-crypto-js';

import appConfig from '@@Config/app';
import { request } from '@@Modules/nerves';
import { generateKeyPair, uniqueHashFromIdentity } from '@@Modules/crypto';
import { makeInfoProps } from '@@Modules/info';
import { getJob } from '@@Modules/job';
import { getKeypair } from '@@Modules/user';
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

export type WithKYC = {
    confirmations: Confirmations;
    kyc: KYC;
}

export type IdentityTypeWithKYC = IdentityType & WithKYC;

type EncryptedIndentity = Record<string, unknown>;

export type IdentityResponseObject = WithKYC & { 
    encryptedIdentity: EncryptedIndentity;
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

export const getIdentityVerificationJob = async (
    jobId: string,
    user: User,
    setInfo: (info: InfoType) => void,
): Promise<[IdentityTypeWithKYC, IdentityTypeWithKYC] | null> => {
    // get job details
    const resJob = await getJob(jobId, user);
    if( !resJob || !resJob.data.success) {
      setInfo(makeInfoProps('error', resJob.data.message || 'error', false));
      return;
    }

    const job = resJob.data.job;
    setInfo(makeInfoProps('info', resJob.data.message, true));

    // get shared keypairs
    const keypairId = `job||${job.creator}||${jobId}`;
    const resSharedKey = await getKeypair(keypairId, user);
    if( !resSharedKey || !resSharedKey.data.success) {
      setInfo(makeInfoProps('error', resSharedKey.data.message || 'error', false));
      return;
    }

    setInfo(makeInfoProps('info', resSharedKey.data.message, true));

    const crypt = new Crypt();

    const rawSharedKeypair = crypt.decrypt(user.keypair.privateKey, JSON.stringify(resSharedKey.data.keypair));
    const sharedKeypair = JSON.parse(rawSharedKeypair.message);
    const decryptedJob = crypt.decrypt(sharedKeypair.privateKey, job.data);
    const message = JSON.parse(decryptedJob.message);

    // get originalData
    const resOriginalData = await request({
      username: user.username,
      wallet: user.wallet,
      url: appConfig.nerves.identity.url,
      method: 'GET',
      params: {
        identityId: job.creator,
      },
    });

    if( !resOriginalData || !resOriginalData.data.success) {
      setInfo(makeInfoProps('error', resOriginalData.data.message || 'error', false));
      return;
    }

    const decryptedOriginal = crypt.decrypt(sharedKeypair.privateKey, resOriginalData.data.identity.encryptedIdentity);
    const decryptedOriginalIdentity = JSON.parse(decryptedOriginal.message);

    setInfo(makeInfoProps('info', '', false));

    return [
        {
            ...message,
            confirmations: resOriginalData.data.identity.confirmations,
            kyc: resOriginalData.data.identity.kyc,
        },
        {
            ...decryptedOriginalIdentity,
            confirmations: resOriginalData.data.identity.confirmations,
            kyc: resOriginalData.data.identity.kyc,
        },
    ];
};