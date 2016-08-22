
import {DataStore} from './interface';

export class StubDataStore implements DataStore {
    private data = new Map<string, string>();

    async setValue(key: string, value: string) {
        this.data.set(key, value);
    }

    async getValue(key: string) {
        if (!this.data.has(key)) {
            throw new Error("Invalid key");
        }
        
        return this.data.get(key);
    }
}
