
import {Crypto} from '../crypto';
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

    async getValue(scope: string, key: string) {
        let scopeKeyId = this.getScopeKeyId(scope);

        let scopedKey = makeScopedKey(scope, key);
        let storeCiphertextBlob = await this.dataStore.getValue(scopedKey);
        let jsonData = await this.crypto.decryptJsonData(storeCiphertextBlob, scopedKey);

        /*let clientCiphertextBlob = await this.crypto.encryptJsonData(jsonData, scopeKeyId);

        return clientCiphertextBlob;*/
        return jsonData;
    }

    async putValue(scope: string, key: string, value: string) {
        let scopedKey = makeScopedKey(scope, key);

        let storeCiphertextBlob = await this.crypto.encryptJsonData(value, this.config.masterKeyId, scopedKey);

        await this.dataStore.setValue(scopedKey, storeCiphertextBlob);
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
