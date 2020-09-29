import type { AxiosResponse } from 'axios';

import type { RequestReponseObject } from '@@Modules/nerves';

export type Confirmations = [ number, number ];

export type KYC = boolean;

export type IdentityType = {
    firstname: string;
    lastname: string;
    nation: string;
    nationalId: string;
}

type EncryptedIndentity = Record<string, unknown>;

type IdentityResponseObject = { 
    encryptedIdentity: EncryptedIndentity;
    confirmations: Confirmations;
    kyc: KYC;
};

export type RequestIdentityResponseObject = RequestReponseObject & { 
    identity: IdentityResponseObject;
};

export type RequestIdentityResponse = AxiosResponse<RequestIdentityResponseObject>;
