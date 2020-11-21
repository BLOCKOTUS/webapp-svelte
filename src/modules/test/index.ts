
import appConfig from '@@Config/app';
import { request } from '@@Modules/nerves';

const didRequest = (
    {
        methodName,
        methodSpecificId,
        urlPath,
        query,
        fragment,
        user,
    },
) => 
    request({
        username: user.username,
        wallet: user.wallet,
        url: appConfig.nerves.did.url,
        method: 'GET',
        params: {
            methodName,
            methodSpecificId,
            urlPath,
            query,
            fragment,
        },          
    });

export const testDidUrl = (user) => {
    return didRequest({
        methodName: 'blockotus',
        methodSpecificId: 'user:someuserid',
        urlPath: '',
        query: {},
        fragment: '',
        user,
    });
};