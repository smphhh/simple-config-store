
import {Crypto} from './interface';

let separator = "!";

export class StubCrypto implements Crypto {
    constructor(
        private keys: { [key: string]: string }
    ) {
    }

    async encryptJsonData(data: any, keyId: string) {
        let key = this.getKey(keyId);

        let serializedData = JSON.stringify(data);
        let ciphertext = [keyId, key, serializedData].map(StubCrypto.base64Encode).join(separator);

        return ciphertext;
    }

    async decryptJsonData(ciphertext: string) {
        let parts = ciphertext.split(separator);

        if (parts.length !== 3) {
            throw new Error("Invalid ciphertext blob");
        }

        let [keyId, key, serializedData] = parts.map(StubCrypto.base64Decode);

        if (keyId.length > 0 && key.length > 0 && this.getKey(keyId) === key) {
            return JSON.parse(serializedData);
        } else {
            throw new Error("Cannot decrypt data");
        }
    }

    private static base64Encode(s: string) {
        return (new Buffer(s, 'utf8')).toString('base64');
    }

    private static base64Decode(s: string) {
        return (new Buffer(s, 'base64')).toString('utf8');
    }

    private getKey(keyId: string) {
        let key = this.keys[keyId];
        if (key === undefined) {
            throw new Error(`Invalid key id: ${keyId}`);
        } else {
            return key;
        }
    }
}
