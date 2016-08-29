
export function create() {
    let region = 'eu-west-1';

    let masterKeyId = "37c5f34d-fbba-4e3f-af56-e0a89d61f17d";

    return {
        region: region,
        server: {
            port: 49125
        },
        configStore: {
            masterKeyId: masterKeyId,
            scopeKeyIds: new Map([
                ['scope1', "99c7e837-dde3-43b7-971c-a134bb42b133"],
                ['scope2', "99c7e837-dde3-43b7-971c-a134bb42b133"]
            ])
        },
        dynamoDBDataStore: {
            endpoint: "http://localhost:8000",
            region: region,
            tableName: "test-ConfigStore"
        }
    };
}
