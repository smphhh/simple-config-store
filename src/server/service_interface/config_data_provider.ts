
import {definePromiseMethod} from 'simple-typed-rpc';

export class ConfigDataProvider {
    static interfaceVersion = "1.0";

    getScopeEncryptedValue(scope: string, key: string) {
        return definePromiseMethod<string>();
    }
}