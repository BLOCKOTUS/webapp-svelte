export default {
    title: 'BLOCKOTUS',
    apps: {
        kyc: {
            appName: 'KYC',
            title: 'KYC'
        },
    },
    nerves: {
        user: {
            keypair: {
                url:  'http://localhost:3000/user/keypair'
            },
            url: 'http://localhost:3000/user'
        },
        identity: {
            url: 'http://localhost:3000/identity'
        },
        job: {
            url: 'http://localhost:3000/job'
        }
    }
}