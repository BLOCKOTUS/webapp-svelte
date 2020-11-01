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
}

export type WorkerType = {
    _id: string;
    publicKey: string;
}

type JobResponseObject = { 
    job: JobType;
};

type JobListResponseObject = { list: Array<{jobId: string}> };

export type RequestJobResponseObject = RequestReponseObject & JobResponseObject;
export type RequestJobListResponseObject = RequestReponseObject & JobListResponseObject;

export type RequestJobResponse = AxiosResponse<RequestJobResponseObject>;
export type RequestJobListResponse = AxiosResponse<RequestJobListResponseObject>;

export const getJob = (
    jobId: string,
    user: User,
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

export const onClickApproveRefuse = async (
    jobId: string,
    result: 0 | 1,
    user: User,
    setInfo: (info: InfoType) => void,
): Promise<void> => {
    setInfo(makeInfoProps('info', 'Submiting result...', true));

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
        setInfo(makeInfoProps('error', e.message || 'error', false));
    });

    if(!resComplete) return;

    if(!resComplete.data.success){
        setInfo(makeInfoProps('error', resComplete.data.message || 'error', false));
        return;
    }

    setInfo(makeInfoProps('info', 'Job complete. You will be redirected to the job list.', true));
    setTimeout(() => push('/kyc/jobs'), 1500);
};

export const decryptJob = (
    keypair: Keypair,
    encryptedJob: Encrypted,
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
