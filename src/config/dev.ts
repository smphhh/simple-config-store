
export function create() {
    let region = 'eu-west-1';

    let masterKeyId = "37c5f34d-fbba-4e3f-af56-e0a89d61f17d";

    return {
        region: region,
        server: {
            port: 80
        },
        configStore: {
            masterKeyId: masterKeyId,
            scopeKeyIds: new Map([
                ['scope1', masterKeyId]
            ])
        },
        dynamoDBDataStore: {
            endpoint: "http://localhost:8000",
            region: region,
            tableName: "ConfigStore"
        }
    };
}
