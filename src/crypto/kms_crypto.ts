
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

    async encryptJsonData(data: any, keyId: string, additionalContext?: string) {
        let serializedData = JSON.stringify(data);

        let params = {
            KeyId: keyId,
            Plaintext: serializedData,
            EncryptionContext: makeEncryptionContext(additionalContext)
        };

        let responseData = await this.kms.encrypt(params).promise();

        return responseData.CiphertextBlob.toString('base64');
    }

    async decryptJsonData(ciphertext: string, additionalContext?: string) {
        let params = {
            CiphertextBlob: new Buffer(ciphertext, 'base64'),
            EncryptionContext: makeEncryptionContext(additionalContext)
        };

        let responseData = await this.kms.decrypt(params).promise();

        let serializedData = responseData.Plaintext;

        return JSON.parse(serializedData);
    }

}

const commonEncryptionContext = {
    serviceName: "simple-config-store",
    serviceTag: "2TykS8ie0XxwjqNFWcCN"
};

function makeEncryptionContext(additionalContext?: string) {
    if (additionalContext === undefined) {
        return commonEncryptionContext;
    } else {
        return Object.assign({ additionalContext }, commonEncryptionContext);
    }
}
