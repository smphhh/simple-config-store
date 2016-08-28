
import {Crypto} from '../../common/crypto';
import {DataStore} from '../data_store';
import {ConfigDataProvider} from '../service_interface';

export interface Config {
    masterKeyId: string;
    scopeKeyIds: Map<string, string>;
}

export class ConfigStore implements ConfigDataProvider {
    constructor(
        private config: Config,
        private crypto: Crypto,
        private dataStore: DataStore
    ) {
    }

    async getScopeValue(scope: string, key: string) {
        let scopeKeyId = this.getScopeKeyId(scope);

        let scopedKey = makeScopedKey(scope, key);
        let ciphertextBlob = await this.dataStore.getScopeValue(scope, key);
        let jsonData = await this.crypto.decryptJsonData(ciphertextBlob, scopedKey);

        return jsonData;
    }

    async getAllScopeValues(scope: string) {
        let scopeKeyId = this.getScopeKeyId(scope);

        let ciphertextData = await this.dataStore.getAllScopeValues(scope);
        let jsonData = {} as { [key: string]: string };
        for (let name in ciphertextData) {
            let scopedName = makeScopedKey(scope, name);
            jsonData[name] = await this.crypto.decryptJsonData(ciphertextData[name], scopedName);
        }

        return jsonData;
    }

    async getScopeEncryptedValue(scope: string, key: string) {
        let scopeKeyId = this.getScopeKeyId(scope);
        let scopedKey = makeScopedKey(scope, key);

        let storeCiphertextBlob = await this.dataStore.getScopeValue(scope, key);

        let clientCiphertextBlob = await this.crypto.reEncryptJsonData(
            storeCiphertextBlob,
            scopeKeyId,
            scopedKey,
            scopedKey
        );

        return clientCiphertextBlob;
    }

    async putScopeValue(scope: string, key: string, value: string) {
        let scopedKey = makeScopedKey(scope, key);

        let ciphertextBlob = await this.crypto.encryptJsonData(value, this.config.masterKeyId, scopedKey);

        await this.dataStore.setScopeValue(scope, key, ciphertextBlob);
    }

    private getScopeKeyId(scope: string) {
        if (this.config.scopeKeyIds.has(scope)) {
            return this.config.scopeKeyIds.get(scope);
        } else {
            throw new Error(`Invalid scope: ${scope}`);
        }
    }

}

function makeScopedKey(scope: string, key: string) {
    return `${scope}/${key}`;
}
