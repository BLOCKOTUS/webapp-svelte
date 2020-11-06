import { push } from 'svelte-spa-router';
import { Crypt } from 'hybrid-crypto-js';
import {isEqual } from 'lodash';
import type { AxiosResponse } from 'axios';

import appConfig from '@@Config/app';
import { request } from '@@Modules/nerves';
import { generateKeyPair, uniqueHashFromIdentity } from '@@Modules/crypto';
import { makeInfoProps } from '@@Modules/info';
import { getJob, decryptJob, getJobList, postJob } from '@@Modules/job';
import { getEncryptedKeypair, decryptKeypair, postEncryptedKeypair } from '@@Modules/user';
import type { InfoType } from '@@Modules/info';
import type { RequestReponseObject } from '@@Modules/nerves';
import type { User } from '@@Modules/user';
import type { UsersType } from '@@Modules/user';
import type { Keypair, Encrypted } from '@@Modules/crypto';

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
    uniqueHash: string;
}

export type WithKYC = {
    confirmations: Confirmations;
    kyc: KYC;
}

export type IdentityTypeWithKYC = IdentityType & WithKYC;

type EncryptedIndentity = string;

export type IdentityResponseObject = WithKYC & { 
    encryptedIdentity: EncryptedIndentity;
    uniqueHash: string;
};

export type RequestIdentityResponseObject = RequestReponseObject & { 
    identity: IdentityResponseObject;
};

export type RequestIdentityResponse = AxiosResponse<RequestIdentityResponseObject>;

export const validateDocumentationUrl = (url: string): boolean => {
    const regex = /^https?:\/\/imgur.com\/a\/([\w]{7})$/gm;
    return regex.test(url);
};

export const getIdentity = async (
    user: User,
    id?: string,
): Promise<RequestIdentityResponse> => 
    request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.identity.url,
        method: 'GET',
        params: {
            identityId: id,
        },
    });

export const postIdentity = async (
    user: User,
    encryptedIdentity: Encrypted,
    uniqueHash: string,
): Promise<RequestIdentityResponse> => 
    request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.identity.url,
        method: 'POST',
        data: {
            encryptedIdentity,
            uniqueHash,
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

    // get job list containing the jobId used for identity verification
    const resJobList = await getJobList({user, chaincode: 'identity', key: user.id});
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
    const decryptedIdentity = decryptIdentity(sharedKeypair, resIdentity.data.identity);
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

    // validate documentation url
    if (!validateDocumentationUrl(citizen.documentation)) {
        info = makeInfoProps('error', 'Documentation URL is incorrect. Format: https://imgur.com/a/5a15vOr', false);
        setInfo(info);
        return info;
    }

    // create keypair (to be shared later)
    const keypairToShare = await generateKeyPair();

    // encrypt the identity with the publicKey
    const encryptedIdentity = crypt.encrypt(keypairToShare.publicKey, JSON.stringify(citizen));
    
    // post the identity to the nerves
    const resIdentity = await postIdentity(user, encryptedIdentity, uniqueHashFromIdentity(citizen));
    if (!resIdentity || !resIdentity.data.success){
        info = makeInfoProps('error', resIdentity.data.message, false);
        setInfo(info);
        return info;
    }
    info = makeInfoProps('info', resIdentity.data.message, true);
    setInfo(info);
    
    // create verification jobs
    const resJob = await postJob(user, encryptedIdentity);
    if (!resJob || !resJob.data.success) {
        info = makeInfoProps('error', resJob.data.message, false);
        setInfo(info);
        return info;
    }
    info = makeInfoProps('info', resJob.data.message, true);
    setInfo(info);
    const { workersIds, jobId } = resJob.data;

    // share the keypair with the workers
    const myEncryptedKeyPair = JSON.stringify(crypt.encrypt(user.keypair.publicKey, JSON.stringify(keypairToShare)));
    const resKeypair = await postEncryptedKeypair(workersIds, keypairToShare, jobId, myEncryptedKeyPair, user);
    if (!resKeypair || !resKeypair.data.success) {
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
    const resJob = await getJob(user, jobId);
    if( !resJob || !resJob.data.success) {
      setInfo(makeInfoProps('error', resJob.data.message || 'error', false));
      return null;
    }
    setInfo(makeInfoProps('info', resJob.data.message, true));
    const job = resJob.data.job;

    // get shared keypair to decrypt the job
    const keypairId = `job||${job.creator}||${jobId}`;
    const resEncryptedKeypair = await getEncryptedKeypair(keypairId, user);
    if( !resEncryptedKeypair || !resEncryptedKeypair.data.success) {
      setInfo(makeInfoProps('error', resEncryptedKeypair.data.message || 'error', false));
      return null;
    }
    setInfo(makeInfoProps('info', resEncryptedKeypair.data.message, true));
    const sharedKeypair = decryptKeypair(user, resEncryptedKeypair.data.keypair);
    const decryptedJob = decryptJob(sharedKeypair, job.data);

    // get job creator identity
    const resCreatorIdentity = await getIdentity(user, job.creator);
    if( !resCreatorIdentity || !resCreatorIdentity.data.success) {
      setInfo(makeInfoProps('error', resCreatorIdentity.data.message || 'error', false));
      return null;
    }
    setInfo(makeInfoProps('info', '', false));
    const creatorIdentity = decryptIdentity(sharedKeypair, resCreatorIdentity.data.identity);

    return [
        {
            ...decryptedJob,
            uniqueHash: uniqueHashFromIdentity(decryptedJob),
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
    identityResponseObject: IdentityResponseObject,
): IdentityType => {
    const crypt = new Crypt();
    const rawIdentity = crypt.decrypt(keypair.privateKey, identityResponseObject.encryptedIdentity);
    return { ...JSON.parse(rawIdentity.message), uniqueHash: identityResponseObject.uniqueHash };
};

export const canApproveIdentityVerificationJob = (
    verificationJob: [IdentityTypeWithKYC, IdentityTypeWithKYC] | null,
): boolean => 
    verificationJob
    && verificationJob[0].uniqueHash === verificationJob[1].uniqueHash
    && isEqual(verificationJob[0], verificationJob[1]);

export const submitCreateIdentity = async (
    e: Event,
    user: User,
    users: UsersType,
    citizen: IdentityType,
    setInfo: (info: InfoType) => void,
): Promise<void> => {
    e.preventDefault();
    const info = await createIdentity(citizen, user, setInfo);
    if (info.type === 'info') {
        let loggedInUser = users.users.filter(u => u.username === users.loggedInUser)[0];
        const loggedIndex = users.users.indexOf(loggedInUser);
        loggedInUser = { ...loggedInUser, identity: {...citizen} };
        users.users[loggedIndex] = loggedInUser;
        setTimeout(() => push('/'), 3000);
    }
};

export const submitRegisterIsDisabled = (citizen: IdentityType): boolean =>
    citizen.firstname.length === 0
    || citizen.lastname.length === 0
    || citizen.nation.length === 0
    || citizen.nationalId.length === 0
    || citizen.birthdate.length !== 10
    || citizen.documentation.length === 0;
