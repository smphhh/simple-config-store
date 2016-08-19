
let AWS = require('aws-sdk');

import {Crypto} from './interface';

export interface Config {
    region: string;
}

export class KmsCrypto implements Crypto {
    private kms: any;

    constructor(
        private config: Config
    ) {
        this.kms = new AWS.KMS({ region: config.region });
    }

    async encryptJsonData(data: any, keyId: string) {
        let serializedData = JSON.stringify(data);

        let params = {
            KeyId: keyId,
            Plaintext: serializedData
        };

        let responseData = await this.kms.encrypt(params).promise();

        return responseData.CiphertextBlob;
    }

    async decryptJsonData(ciphertext: string) {
        let params = {
            CiphertextBlob: ciphertext
        };

        let responseData = await this.kms.decrypt(params).promise();

        let serializedData = responseData.Plaintext;

        return JSON.parse(serializedData);
    }

}
