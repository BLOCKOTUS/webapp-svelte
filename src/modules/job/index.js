import axios from 'axios';

import * as job from '@@Fixtures/job';

export const submit = async (job) => {
    const response = axios
        .post('http://localhost:3000/job', job)
        .catch(e => {
            return Promise.reject(e)
        })


    return JSON.parse(response).data;

}

export const get = id => job.list[id];
export const getList = () => job.list;