import type { AxiosResponse } from 'axios';
import { Crypt } from 'hybrid-crypto-js';
import {isEqual } from 'lodash';

import appConfig from '@@Config/app';
import { request } from '@@Modules/nerves';
import { generateKeyPair, uniqueHashFromIdentity } from '@@Modules/crypto';
import { makeInfoProps } from '@@Modules/info';
import { getJob, decryptJob, getJobList } from '@@Modules/job';
import { getEncryptedKeypair, decryptKeypair } from '@@Modules/user';
import type { InfoType } from '@@Modules/info';
import type { RequestReponseObject } from '@@Modules/nerves';
import type { User, Keypair } from '@@Modules/user';
import type { SharedWithKeypair } from '@@Modules/user';
import type { WorkerType } from '@@Modules/job';
import type { Encrypted } from '@@Modules/crypto';

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

type EncryptedIndentity = string;

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

export const getIdentity = async (
    user: User,
    id?: string,
): Promise<RequestIdentityResponse> => await request({
    username: user.username,
    wallet: user.wallet,
    url: appConfig.nerves.identity.url,
    method: 'GET',
    params: {
      identityId: id,
    },
});

export const getMyIdentity = async (
    user: User,
    setInfo: (info: InfoType) => void,
): Promise<IdentityTypeWithKYC> => {
    // get encrypted identity
    const resIdentity = await getIdentity(user);
    if (!resIdentity || !resIdentity.data.success){
        setInfo(makeInfoProps('error', resIdentity.data.message || 'error', false));
    }
    const encryptedIdentity = resIdentity.data.identity.encryptedIdentity;

    // get job list containing the jobId used for identity verification
    const resJobList = await getJobList(user, 'identity', user.id);
    if (!resJobList || !resJobList.data.success){
        setInfo(makeInfoProps('error', resJobList.data.message || 'error', false));
    }
    const jobId = resJobList.data.list[0].jobId;

    // get the keypair used for encrypting the identity
    const keypairId = `job||${user.id}||${jobId}`;
    const resEncryptedKeypair = await getEncryptedKeypair(keypairId, user);
    if (!resEncryptedKeypair || !resEncryptedKeypair.data.success){
        setInfo(makeInfoProps('error', resEncryptedKeypair.data.message || 'error', false));
    }
    const sharedKeypair = decryptKeypair(user, resEncryptedKeypair.data.keypair);

    // decrypt and return the identity
    const decryptedIdentity = decryptIdentity(sharedKeypair, encryptedIdentity);
    setInfo(makeInfoProps('info', '', false));
    const identityWithKyc: IdentityTypeWithKYC = { 
        ...decryptedIdentity,
        kyc: resIdentity.data.identity.kyc,
        confirmations: resIdentity.data.identity.confirmations,
    };
    return identityWithKyc;
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
    const myEncryptedKeyPair = JSON.stringify(crypt.encrypt(user.keypair.publicKey, JSON.stringify(keypairToShare)));
    const sharedWith = workersIds.reduce(
        (acc: SharedWithKeypair, worker: WorkerType) => {
            return ({
                ...acc,
                [worker._id]: { keypair: JSON.stringify(crypt.encrypt(worker.publicKey, JSON.stringify(keypairToShare))) },
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
    // get job
    const resJob = await getJob(jobId, user);
    if( !resJob || !resJob.data.success) {
      setInfo(makeInfoProps('error', resJob.data.message || 'error', false));
      return;
    }
    setInfo(makeInfoProps('info', resJob.data.message, true));
    const job = resJob.data.job;

    // get shared keypair to decrypt the job
    const keypairId = `job||${job.creator}||${jobId}`;
    const resEncryptedKeypair = await getEncryptedKeypair(keypairId, user);
    if( !resEncryptedKeypair || !resEncryptedKeypair.data.success) {
      setInfo(makeInfoProps('error', resEncryptedKeypair.data.message || 'error', false));
      return;
    }
    setInfo(makeInfoProps('info', resEncryptedKeypair.data.message, true));
    const sharedKeypair = decryptKeypair(user, resEncryptedKeypair.data.keypair);
    const decryptedJob = decryptJob(sharedKeypair, job.data);

    // get job creator identity
    const resCreatorIdentity = await getIdentity(user, job.creator);
    if( !resCreatorIdentity || !resCreatorIdentity.data.success) {
      setInfo(makeInfoProps('error', resCreatorIdentity.data.message || 'error', false));
      return;
    }
    setInfo(makeInfoProps('info', '', false));
    const creatorIdentity = decryptIdentity(sharedKeypair, resCreatorIdentity.data.identity.encryptedIdentity);

    return [
        {
            ...decryptedJob,
            confirmations: resCreatorIdentity.data.identity.confirmations,
            kyc: resCreatorIdentity.data.identity.kyc,
        },
        {
            ...creatorIdentity,
            confirmations: resCreatorIdentity.data.identity.confirmations,
            kyc: resCreatorIdentity.data.identity.kyc,
        },
    ];
};

export const decryptIdentity = (
    keypair: Keypair,
    encryptedIdentity: Encrypted,
): IdentityType => {
    const crypt = new Crypt();
    const rawIdentity = crypt.decrypt(keypair.privateKey, encryptedIdentity);
    return JSON.parse(rawIdentity.message);
};

export const canApproveIdentityVerificationJob = (
    verificationJob: [IdentityTypeWithKYC, IdentityTypeWithKYC],
): boolean => 
    uniqueHashFromIdentity(verificationJob[0]) === uniqueHashFromIdentity(verificationJob[1])
    && isEqual(verificationJob[0], verificationJob[1]);
