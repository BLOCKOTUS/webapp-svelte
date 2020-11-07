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
    {
        users,
        setUsers,
    }: {
        users: UsersType,
        setUsers?: (u: UsersType) => void,
    },
): void => {
    const newUsers = [...users.users, {... users.tmp}];
    users.users = newUsers;
    users.loggedInUser = `${users.tmp.username}`;

    users.tmp.id = '';
    users.tmp.wallet = null;
    users.tmp.keypair = { publicKey: '', privateKey: '' };
    users.tmp.username = '';
    if (setUsers) setUsers(users);
};

export const login = (
    {
        e,
        users,
        onInfo,
        setUsers,
    }: {
        e: Event,
        users: UsersType,
        onInfo?: (info: InfoType) => void,
        setUsers?: (u: UsersType) => void,
    },
): void => {
    e.preventDefault();

    const setInfo = onInfo ? onInfo : () => null;

    // set info loading
    setInfo(makeInfoProps({ type: 'info', value: '', loading: true }));

    // validate keypair
    validateKeypair(users.tmp.keypair)
        .catch(_e => {
            setInfo(makeInfoProps({ type: 'error', value: 'Keypair is invalid', loading: false }));
            return;
        });

    // verify if already logged in
    if (isAlreadyLogged(users)) {
        setInfo(makeInfoProps({ type: 'error', value: `${users.tmp.username} already logged in.`, loading: false }));
        return;
    }
    
    // perform login action
    loginUser({ users, setUsers });

    setInfo(makeInfoProps({ type: 'info', value: 'Successfully registered.', loading: false}));
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
    {
        username,
        keypair,
    }: {
        username: string,
        keypair: Keypair,
    },
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
    {
        e,
        users,
        onInfo,
        onComplete,
        setUsers,
    }: {
        e: Event,
        users: UsersType,
        onInfo?: (info: InfoType) => void,
        onComplete?: () => void,
        setUsers?: (u: UsersType) => void,
    },
): Promise<void> => {
    e.preventDefault();

    const setInfo = onInfo ? onInfo : () => null;

    setInfo(makeInfoProps({ type: 'info', value: '', loading: true }));

    // generate keypair
    const keypair = await generateKeyPair();

    // get wallet from the network
    const resRegister = await register({ username: users.tmp.username, keypair});
    if (!resRegister || !resRegister.data.success) {
        setInfo(makeInfoProps({ type: 'error', value: resRegister.data.message || 'error', loading: false }));
        return;
    }
    const { wallet, id } = resRegister.data;
    setInfo(makeInfoProps({ type: 'info', value: resRegister.data.message, loading: false }));

    // login user
    const user = {
        username: users.tmp.username,
        wallet,
        keypair,
        id,
    };
    users.tmp = user;
    loginUser({ users, setUsers });

    if (onComplete) onComplete();
};
