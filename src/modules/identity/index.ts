import type { AxiosResponse } from 'axios';

import type { RequestReponseObject } from '@@Modules/nerves';

export type Confirmations = [ number, number ];

export type KYC = boolean;

export type IdentityType = {
    firstname: string;
    lastname: string;
    nation: string;
    nationalId: string;
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
