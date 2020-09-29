import type { AxiosResponse } from 'axios';

import type { RequestReponseObject } from '@@Modules/nerves';

export type WorkerType = {
    _id: string;
    publicKey: string;
}

export type RequestJobResponseObject = RequestReponseObject;

export type RequestJobResponse = AxiosResponse<RequestIdentityResponseObject>;
