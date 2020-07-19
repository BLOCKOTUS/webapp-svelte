// @flow
const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

type Transaction = {
    channelId: string,
    contractName: string,
    keepAlive: boolean,
    transactionName: string,
    trasnsactionArgs: string[]
}

const ccpPath = path.resolve(__dirname, '..', 'fabric', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

const getWallet = async () => {
    const walletPath = path.resolve(__dirname, '..', 'fabric', 'wallet');
    return await Wallets.newFileSystemWallet(walletPath);
}

const submitTransaction = async ({
    channelId = 'blockotus',
    contractName = 'jobs',
    keepAlive = false,
    transactionName,
    trasnsactionArgs
}: Transaction) => {
    var wallet = wallet || await getWallet();
    var gateway = gateway || new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    var network = network || await gateway.getNetwork(channelId);
    var contract = contract || network.getContract(contractName);
    return await contract.submitTransaction(transactionName, ...trasnsactionArgs);
}