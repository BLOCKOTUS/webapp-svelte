import axios, { AxiosPromise } from 'axios';

import type { Wallet } from '@@Modules/user';

export const request = ({
  username = '',
  wallet,
  method,
  url,
  data = {},
  params = {},
}: {
  username?: string;
  wallet?: Wallet;
  method: 'POST' | 'GET';
  url: string;
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
}): AxiosPromise => {
  const options = {
    url,
    data,
    params: params,
    method,
    headers: {
      'Authorization': `Basic ${btoa(`${username}:${JSON.stringify(wallet)}`)}`,
    },
  };

  return axios(options);
};

export type RequestReponseObject = { 
  success: boolean; 
  message: string;
};
