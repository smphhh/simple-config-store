
export interface Crypto {
    encryptJsonData(data: any, keyId: string): Promise<string>;
    decryptJsonData(ciphertext: string): Promise<any>;
}
