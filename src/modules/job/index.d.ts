import type { AxiosResponse } from 'axios';

import type { RequestReponseObject } from '@@Modules/nerves';

export type RequestJobResponseObject = RequestReponseObject;

export type RequestJobResponse = AxiosResponse<RequestIdentityResponseObject>;
