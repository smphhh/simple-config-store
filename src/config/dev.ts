
export function create() {
    let region = 'eu-west-1';

    return {
        region: region,
        server: {
            port: 80
        },
        configStore: {
            masterKeyId: 'a',
            scopeKeyIds: new Map()
        },
        dynamoDBDataStore: {
            endpoint: "http://localhost:8000",
            region: region,
            tableName: "ConfigStore"
        }
    };
}
