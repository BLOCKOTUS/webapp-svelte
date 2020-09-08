import axios from 'axios';

export const request = ({
    username = '',
    wallet = '',
    method,
    url,
    data = {},
    params = {},
}) => {
    const options = {
        url,
        data,
        params: params,
        method,
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${JSON.stringify(wallet)}`)}`
        }
    }

    return axios(options);
}

