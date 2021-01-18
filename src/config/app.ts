export default {
  title: 'BLOCKOTUS',
  apps: {
    kyc: {
      appName: 'KYC',
      title: 'KYC',
    },
  },
  nerves: {
    did: {
      url: 'http://localhost:3000/did',
    },
    user: {
      keypair: {
        url: 'http://localhost:3000/user/keypair',
      },
      url: 'http://localhost:3000/user',
    },
    identity: {
      url: 'http://localhost:3000/identity',
    },
    job: {
      list: {
        url: 'http://localhost:3000/job/list',
      },
      complete: {
        url: 'http://localhost:3000/job/complete',
      },
      url: 'http://localhost:3000/job',
    },
  },
};
