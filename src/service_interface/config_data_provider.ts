
import {definePromiseMethod} from 'simple-typed-rpc';

export class ConfigDataProvider {
    static interfaceVersion = "1.1";

    getScopeEncryptedValue(scope: string, name: string) {
        return definePromiseMethod<{
            encryptedValue: string
        }>();
    }
    
    getAllScopeEncryptedValues(scope: string) {
        return definePromiseMethod<{
            encryptedValues: { [key: string]: string }
        }>();
    }
}
