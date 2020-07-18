import * as jobs from '../../fixtures/jobs';

export const getVerificator = (n) => jobs.verificators[n] || jobs.verificators[0];
export const get = id => jobs.list[id];
export const getList = () => jobs.list;
