import type { AxiosResponse } from 'axios';
import { push } from 'svelte-spa-router';
import { Crypt } from 'hybrid-crypto-js';

import appConfig from '@@Config/app';
import { request } from '@@Modules/nerves';
import { makeInfoProps } from '@@Modules/info';
import type { RequestReponseObject } from '@@Modules/nerves';
import type { InfoType } from '@@Modules/info';
import type { User } from '@@Modules/user';
import type { Encrypted, Keypair } from '@@Modules/crypto';

export type JobType = {
    chaincode: string;
    creator: string;
    data: string;
    type: string;
};

export type WorkerType = {
    _id: string;
    publicKey: string;
};

type JobResponseObject = { 
    job: JobType;
};

type JobListResponseObject = { list: Array<{jobId: string}> };

type PostJobResponseObject = {
    workersIds: Array<WorkerType>;
    jobId: string;
};

export type RequestJobResponseObject = RequestReponseObject & JobResponseObject;
export type RequestPostJobResponseObject = RequestReponseObject & PostJobResponseObject;
export type RequestJobListResponseObject = RequestReponseObject & JobListResponseObject;

export type RequestJobResponse = AxiosResponse<RequestJobResponseObject>;
export type RequestPostJobResponse = AxiosResponse<RequestPostJobResponseObject>;
export type RequestJobListResponse = AxiosResponse<RequestJobListResponseObject>;

export const getJob = (
    {
        user,
        jobId,
    }: {
        user: User,
        jobId: string,
    },
): Promise<RequestJobResponse> =>
    request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.job.url,
        method: 'GET',
        params: {
          jobId,
        },
    });

export const postJob = (
    {
        user,
        encryptedIdentity,
    }: {
        user: User,
        encryptedIdentity: Encrypted,
    },
): Promise<RequestPostJobResponse> => 
    request({
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
    });

export const onClickApproveRefuse = async (
    {
        jobId,
        result,
        user,
        setInfo,
    }: {
        jobId: string,
        result: 0 | 1,
        user: User,
        setInfo: (info: InfoType) => void,
    },
): Promise<void> => {
    setInfo(makeInfoProps({ type: 'info', value: 'Submitting result...', loading: true }));

    const resComplete: RequestJobResponse | void = await request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.job.complete.url,
        method: 'POST',
        data: {
            jobId,
            result,
        },
    }).catch(e => {
        setInfo(makeInfoProps({ type: 'error', value: e.message || 'error', loading: false }));
    });

    if(!resComplete) return;

    if(!resComplete.data.success){
        setInfo(makeInfoProps({ type: 'error', value: resComplete.data.message || 'error', loading: false }));
        return;
    }

    setInfo(makeInfoProps({ type: 'info', value: 'Job complete. You will be redirected to the job list.', loading: true }));
    setTimeout(() => push('/kyc/jobs'), 1500);
};

export const decryptJob = (
    {
        keypair,
        encryptedJob,
    }: {
        keypair: Keypair,
        encryptedJob: Encrypted,
    },
): any => {
    const crypt = new Crypt();
    const rawEncryptedJob = crypt.decrypt(keypair.privateKey, encryptedJob);
    return JSON.parse(rawEncryptedJob.message);
};

export const getJobList = (
    {
        user,
        chaincode,
        key,
        status,
    }: {
        user: User,
        chaincode?: string,
        key?: string,
        status?: string,
}): Promise<RequestJobListResponse> => 
    request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.job.list.url,
        method: 'GET',
        params: {
            chaincode,
            key,
            status,
        },
    });
