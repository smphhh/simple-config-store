
export interface DataStore {
    setScopeValue(scope: string, name: string, value: string): Promise<void>;
    getScopeValue(scope: string, name: string): Promise<string>;
    getAllScopeValues(scope: string): Promise<{ [key: string]: string }>;
}
