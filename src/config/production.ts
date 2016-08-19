
function parseScopeKeyIds() {
    return new Map();
}

export function create() {
    let region = process.env['AWS_REGION'];

    return {
        region: region,
        server: {
            port: 80
        },
        configStore: {
            masterKeyId: process.env['MASTER_KEY_ID'],
            scopeKeyIds: parseScopeKeyIds()
        },
        dynamoDBDataStore: {
            endpoint: undefined,
            region: region,
            tableName: process.env['DYNAMODB_TABLE_NAME']
        }
    };
}
