
export function create() {
    let region = 'eu-west-1';

    return {
        region: region,
        server: {
            port: 80
        },
        configStore: {
            masterKeyId: 'masterKey',
            scopeKeyIds: new Map([
                ['scope1', 'b'],
                ['scope2', 'd']
            ])
        },
        dynamoDBDataStore: {
            endpoint: "http://localhost:8000",
            region: region,
            tableName: "ConfigStore"
        }
    };
}
