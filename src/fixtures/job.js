import { push } from 'svelte-spa-router'

import * as keypairs from './keypairs';

const submit = (encryptedData) => {
    console.log('Encrypted data', encryptedData)
    push('/success/')
}

export const verificators = [
    {
        submit,
        publicKey: keypairs.user2.publicKey,
    },
    {
        submit,
        publicKey: keypairs.user2.publicKey,
        privateKey: keypairs.user2.privateKey,
    }
]

const job1 = {
    id: 42,
    status: 'pending',
    data: '{"v":"hybrid-crypto-js_0.2.2","iv":"Il1GLwZONVFTPlM7ghV1Ya2bB+0RzS2kykUY09g/kOY=","keys":{"cb:7d:60:ef:8c:cc:b6:48:51:65:d9:b3:a5:ba:29:30:ee:fa:92:16":"EeJJhGmBvAVuHFN/ADLTZSZ9+0BH7tNL15UhtdcU/N1S+LI+qdicBTA4D4st3CmO+YK/GEjkRGV53csN2I4MNekZ6FYovcXD4acXBgj7SiKSGWuy21YxOUztHFb1UoXIFvoEJlXmpDJt/ilRl/3ZHVuetfaUuWod6MjNs6U8lvpvDCxjCIcJcX3axUy9dQrdpvCZXcn0iQ+te0JvwC940RlexkzwNsmdyEDSH68Ml/JNzNEsPQMdDD/s215Rerb0/htB40+fXG/YWJovJbMa8/XiADY06BTeSRDCILsmEnRmWxohmhr4+sK/3nBnHPWZxVIOvH9gRXa1rLQOB3zO8Imr1DicNaPTWeUrOAtlzFtqIjqr9YtkutuhZUb3bmMLPGlTS13MTvjVXlsAdYSCiSgzNrW0mAr43r6vPY+baq9v9XjbAUEojEtXBAqBHj4Y0FA4B4cKDe5D7JOhwXKSGgv89L0WceDUmJ2k+iyWW5DGqCbLnkD+3QRUpJTCSD9GvGoyp0Cii2Ebe7YP2ANGda2HiRYR7ORUtZuYnTGnYOQmb31VG7eThcbYm1YFbGvSC2tFawsBH3lK18aX3o10P5q1/RMQIEvjWijZa1m98zM91Y9+70ijESI3vxAckkB/5jt0aLxMzFr3tIPHPAb141ocSA8ahn0njXUP0D0fE0g="},"cipher":"CECA+yitF7/5DPhY3URR6j47l3+CHwUbkJ9HLyh5LTfkBhM1paCypFElfF/eZ+VjbIeN/eT1AfHWHMVkrFz/aTEkr7QhkUdQvEi17unFlEaqL2nBSFrNmmGqwUtFPng9H52XJ2QZr5coXzCvh6h8GtLZCiIZdwayfnpqKtAhm4jrmVAtJIJQCOL4qHuwSYIdM8jMZE1d0+3sabklFxljOzS94/LtNsotFdJxZ2kj8VtjVQXcU4+XBFaSkyxXGGb45h+0r5c6V8GYI+dMUL1zcdpWaCGGi6BFT7UYS6AlAtUPBNcBvb49nV5IDOcH1saa4IRzCS2LC7iV6pJG/YqAiw=="}',
    approve: () => true,
    refuse: () => false
}

export const list = {
    42: job1
};