import type { AxiosResponse } from 'axios';
import { push } from 'svelte-spa-router';

import appConfig from '@@Config/app';
import { request } from '@@Modules/nerves';
import { makeInfoProps } from '@@Modules/info';
import type { RequestReponseObject } from '@@Modules/nerves';
import type { InfoType } from '@@Modules/info';
import type { User } from '@@Modules/user';

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

export type RequestJobResponseObject = RequestReponseObject & JobResponseObject;

export type RequestJobResponse = AxiosResponse<RequestJobResponseObject>;

export const getJob = async (
    jobId: string,
    user: User,
): Promise<RequestJobResponse> => 
    await request({
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
