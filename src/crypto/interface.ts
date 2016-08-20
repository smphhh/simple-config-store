
export interface Crypto {
    encryptJsonData(data: any, keyId: string, additionalContext?: string): Promise<string>;
    decryptJsonData(ciphertext: string, additionalContext?: string): Promise<any>;
    reEncryptJsonData(
        sourceCiphertext: string,
        destinationKeyId: string,
        additionalSourceContext?: string,
        additionalTargetContext?: string
    ): Promise<string>;
}
