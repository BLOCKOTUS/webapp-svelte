
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
        methodSpecificId: btoa('user:Org1MSP::x509::/OU=client/OU=org1/OU=department1/CN=135-dani42::/C=US/ST=North Carolina/O=Hyperledger/OU=Fabric/CN=fabric-ca-server'),
        urlPath: '',
        query: { service: 'user' },
        fragment: '',
        user,
    });
};