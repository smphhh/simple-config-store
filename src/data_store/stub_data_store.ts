
import {DataStore} from './interface';

export class StubDataStore implements DataStore {
    private data = new Map<string, string>();

    async setScopeValue(scope: string, key: string, value: string) {
        this.data.set(key, value);
    }

    async getScopeValue(scope: string, key: string) {
        if (!this.data.has(key)) {
            throw new Error("Invalid key");
        }
        
        return this.data.get(key);
    }

    async getAllScopeValues(scope: string) {
        return {
            a: "a"
        } as { [key: string]: string };
    }
}
