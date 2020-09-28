export type Keypair = {
    publicKey: string,
    privateKey: string,
} 

export type Account = {
    id: string, 
    username: string,
}

export type User = {
    username: string,
    wallet: string,
    keypair: Keypair,
}