
export interface Crypto {
    encryptJsonData(data: any, keyId: string, additionalContext?: string): Promise<string>;
    decryptJsonData(ciphertext: string, additionalContext?: string): Promise<any>;
}
