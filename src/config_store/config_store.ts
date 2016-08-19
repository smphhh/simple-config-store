
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

        let storeCiphertextBlob = await this.dataStore.getValue(`${scope}/${key}`);
        let jsonData = await this.crypto.decryptJsonData(storeCiphertextBlob);

        let clientCiphertextBlob = await this.crypto.encryptJsonData(jsonData, scopeKeyId);

        return clientCiphertextBlob;
    }

    async putValue(scope: string, key: string, value: any) {
        let storeCiphertextBlob = await this.crypto.encryptJsonData(value, this.config.masterKeyId);
    }

    private getScopeKeyId(scope: string) {
        if (this.config.scopeKeyIds.has(scope)) {
            return this.config.scopeKeyIds.get(scope);
        } else {
            throw new Error(`Invalid scope: ${scope}`);
        }
    }

}
