
import {createInterfaceDescriptorFrontendProxy} from 'simple-typed-rpc';

import {Crypto} from '../crypto';
import {makeScopedName} from '../utils';
import {ConfigDataProvider} from '../service_interface';

export interface Config {
}

export class ConfigStoreClient {
    constructor(
        private config: Config,
        private crypto: Crypto,
        private dataProvider: ConfigDataProvider
    ) {
    }

    async getScopeValue(scope: string, name: string) {
        let data = await this.dataProvider.getScopeEncryptedValue(scope, name);
        let scopedName = makeScopedName(scope, name);
        let value = await this.crypto.decryptJsonData(data.encryptedValue, scopedName);
        return value;
    }

    async getAllScopeValues(scope: string) {
        let data = await this.dataProvider.getAllScopeEncryptedValues(scope);
        let values = {} as any;
        for (let name in data.encryptedValues) {
            let scopedName = makeScopedName(scope, name);
            let value = await this.crypto.decryptJsonData(data.encryptedValues[name], scopedName);
            values[name] = value;
        }

        return values;
    }

}


