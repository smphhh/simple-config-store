
import {Crypto} from '../crypto';
import {makeScopedName} from '../utils';
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

    async getScopeValue(scope: string, name: string) {
        let scopeKeyId = this.getScopeKeyId(scope);

        let scopedKey = makeScopedName(scope, name);
        let ciphertextBlob = await this.dataStore.getScopeValue(scope, name);
        let jsonData = await this.crypto.decryptJsonData(ciphertextBlob, scopedKey);

        return jsonData;
    }

    async getAllScopeValues(scope: string) {
        let scopeKeyId = this.getScopeKeyId(scope);

        let ciphertextData = await this.dataStore.getAllScopeValues(scope);
        let jsonData = {} as { [key: string]: string };
        for (let name in ciphertextData) {
            let scopedName = makeScopedName(scope, name);
            jsonData[name] = await this.crypto.decryptJsonData(ciphertextData[name], scopedName);
        }

        return jsonData;
    }

    async getScopeEncryptedValue(scope: string, name: string) {
        let scopeKeyId = this.getScopeKeyId(scope);
        let scopedName = makeScopedName(scope, name);

        let storeCiphertextBlob = await this.dataStore.getScopeValue(scope, name);

        let clientCiphertextBlob = await this.crypto.reEncryptJsonData(
            storeCiphertextBlob,
            scopeKeyId,
            scopedName,
            scopedName
        );

        return {
            encryptedValue: clientCiphertextBlob
        };
    }

    async getAllScopeEncryptedValues(scope: string) {
        let scopeKeyId = this.getScopeKeyId(scope);

        let storeCiphertextData = await this.dataStore.getAllScopeValues(scope);
        let jsonData = {} as { [key: string]: string };
        
        for (let name in storeCiphertextData) {
            let scopedName = makeScopedName(scope, name);
            let clientCiphertextBlob = await this.crypto.reEncryptJsonData(
                storeCiphertextData[name],
                scopeKeyId,
                scopedName,
                scopedName
            );

            jsonData[name] = clientCiphertextBlob;
        }

        return {
            encryptedValues: jsonData
        };
    }

    async setScopeValue(scope: string, key: string, value: string) {
        let scopedKey = makeScopedName(scope, key);

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
