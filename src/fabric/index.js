const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');


const getWallet = async () => {
    const walletPath = path.resolve(__dirname, '..', 'fabric', 'wallet');
    wallet = await Wallets.newFileSystemWallet(walletPath);
    return wallet;
}

const getGateway = () => {
    const gateway = gateway || new Gateway();
}

const submitTransaction = async ({
    channelid = 'blockotus',
    contract = 'jobs',
    keepAlive = false,
    transaction
}) => {
    const ccpPath = path.resolve(__dirname, '..', 'fabric', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = wallet || await getWallet();
    const gateway = getGateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork(channelid);
    const contract = network.getContract(contract);
    return await contract.submitTransaction(...transaction);
}