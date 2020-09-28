import axios, { AxiosPromise } from 'axios';

export const request = ({
  username = '',
  wallet = '',
  method,
  url,
  data = {},
  params = {},
}: {
  username: string,
  wallet: string,
  method: 'POST' | 'GET',
  url: string,
  data?: Record<string, unknown>,
  params?: Record<string, unknown>,
}): AxiosPromise<unknown> => {
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

