
function parseScopeKeyIds(scopeKeyIdData: string) {
    if (typeof scopeKeyIdData !== 'string') {
        return new Map();
    }

    let scopeKeyIds = new Map<string, string>();

    for (let scopeKeyIdPair of scopeKeyIdData.split("\n")) {
        if (scopeKeyIdPair.length === 0) {
            // Skip empty rows
            continue;
        }

        let pairData = scopeKeyIdPair.split(",");

        if (pairData.length !== 2) {
            throw new Error(`Invalid scope key-id pair data: ${scopeKeyIdPair}`);
        }

        scopeKeyIds.set(pairData[0], pairData[1]);
    }
        
    return scopeKeyIds;
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
            scopeKeyIds: parseScopeKeyIds(process.env['SCOPE_KEY_IDS'])
        },
        dynamoDBDataStore: {
            endpoint: undefined,
            region: region,
            tableName: process.env['DYNAMODB_TABLE_NAME']
        }
    };
}
