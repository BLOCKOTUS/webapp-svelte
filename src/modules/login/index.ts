import { push } from 'svelte-spa-router';
import type { AxiosResponse } from 'axios';

import appConfig from '@@Config/app';
import { validateKeypair, generateKeyPair } from '@@Modules/crypto';
import { makeInfoProps } from '@@Modules/info';
import { request } from '@@Modules/nerves';
import type { User, UsersType, Wallet } from '@@Modules/user';
import type { InfoType } from '@@Modules/info';
import type { Keypair } from '@@Modules/crypto';
import type { RequestReponseObject } from '@@Modules/nerves';

export type RegisterResponseObject = { 
    wallet: Wallet;
    id: string;
};

export type RequestRegisterResponseObject = RequestReponseObject & RegisterResponseObject;

export type RequestRegisterResponse = AxiosResponse<RequestRegisterResponseObject>;

export const isAlreadyLogged = (
    users: UsersType,
): boolean => 
    users
        .users
        .filter((u: User) => u.username === users.tmp.username)
        .length > 0;

export const loginUser = (
    users: UsersType,
): void => {
    const newUsers = [...users.users, {... users.tmp}];
    users.users = newUsers;
    users.loggedInUser = `${users.tmp.username}`;

    users.tmp.id = '';
    users.tmp.wallet = null;
    users.tmp.keypair = { publicKey: '', privateKey: '' };
    users.tmp.username = '';
};

export const login = (
    e: Event,
    users: UsersType,
    setInfo: (info: InfoType) => void,
): void => {
    e.preventDefault();

    // set info loading
    setInfo(makeInfoProps('info', '', true));

    // validate keypair
    validateKeypair(users.tmp.keypair)
        .catch(_e => {
            setInfo(makeInfoProps('error', 'Keypair is invalid', false));
            return;
        });

    // verify if already logged in
    if (isAlreadyLogged(users)) {
        setInfo(makeInfoProps('error', `${users.tmp.username} already logged in.`, false));
        return;
    }
    
    // perform login action
    loginUser(users);

    setInfo(makeInfoProps('info', 'Successfully registered.', false));
    return;
};

export const submitLoginIsDisabled = (
    users: UsersType,
): boolean => 
    users.tmp.username.length === 0
    || users.tmp.keypair.privateKey.length === 0
    || users.tmp.keypair.publicKey.length === 0
    || users.tmp.wallet === null;

export const register = (
    username: string,
    keypair: Keypair,
): Promise<RequestRegisterResponse> =>
    request({
        method: 'POST',
        url: appConfig.nerves.user.url,
        data: {
            username,
            publicKey: keypair.publicKey,
        },
    });

export const submitRegister = async (
    e: Event,
    users: UsersType,
    setInfo: (info: InfoType) => void,
): Promise<void> => {
    e.preventDefault();
    setInfo(makeInfoProps('info', '', true));

    // generate keypair
    const keypair = await generateKeyPair();

    // get wallet from the network
    const resRegister = await register(users.tmp.username, keypair);
    if (!resRegister || !resRegister.data.success) {
        setInfo(makeInfoProps('error', resRegister.data.message || 'error', false));
        return;
    }
    const { wallet, id } = resRegister.data;
    setInfo(makeInfoProps('info', resRegister.data.message, false));

    // login user
    const user = {
        username: users.tmp.username,
        wallet,
        keypair,
        id,
    };
    users.tmp = user;
    loginUser(users);

    // redirect to home page
    setTimeout(() => push('/'), 1000);
};
