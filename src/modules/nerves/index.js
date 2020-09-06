import axios from 'axios';

export const request = ({
    username = '',
    wallet = '',
    method,
    url,
    data = {}
}) => {
    const options = {
        url,
        data,
        method,
        headers: {
            'Authorization': `Basic ${btoa(`${username}:${JSON.stringify(wallet)}`)}`
        }
    }

    return axios(options);
}

