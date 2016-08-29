
let AWS = require('aws-sdk');

import {makeScopedName} from '../../../common/utils';

import {DataStore} from '../interface';

export interface Config {
    region: string;
    endpoint?: string;
    tableName: string;
}

export class DynamoDBDataStore implements DataStore {
    private dynamoDB: any;
    private docClient: any;

    private bootstrapPromise: Promise<void>;
    private ready = false;

    constructor(
        private config: Config
    ) {
        this.dynamoDB = new AWS.DynamoDB({
            region: config.region,
            endpoint: config.endpoint
        });

        this.docClient = new AWS.DynamoDB.DocumentClient({
            service: this.dynamoDB
        });

        this.bootstrapPromise = this.bootstrap();
    }

    async setScopeValue(scope: string, name: string, value: string) {
        let scopedName = makeScopedName(scope, name);
        let response = await this.docClient.put({
            TableName: this.config.tableName,
            Item: {
                scopedName: scopedName,
                version: 1,
                indexScope: scope,
                value: value
            }
        }).promise();
    }

    getScopeValue(scope: string, name: string) {
        return this.getValue(makeScopedName(scope, name))
    }

    private async getValue(scopedName: string) {
        let response = await this.docClient.get({
            TableName: this.config.tableName,
            Key: {
                scopedName: scopedName,
                version: 1
            }
        }).promise();

        return response.Item.value as string;
    }

    async getAllScopeValues(scope: string) {
        let response = await this.docClient.query({
            TableName: this.config.tableName,
            IndexName: scopeNameIndexName,
            KeyConditionExpression: "indexScope = :scope",
            ExpressionAttributeValues: {
                ":scope": scope
            },
            ProjectionExpression: "scopedName"
        }).promise();

        let responseItems = response.Items as { scopedName: string }[];

        let scopedNames = responseItems.map(item => item.scopedName);

        let values = {} as { [key: string]: string };
        for (let scopedName of scopedNames) {
            let name = scopedName.split("/")[1];
            let value = await this.getScopeValue(scope, name);
            values[name] = value;
        }

        return values;
    }

    async recreateTable() {
        try {
            await this.dynamoDB.deleteTable({ TableName: this.config.tableName }).promise();
        } catch (error) {
            if (error.name !== "ResourceNotFoundException") {
                throw error;
            }
        }

        await this.dynamoDB.createTable({
            "TableName": this.config.tableName,
            "AttributeDefinitions": [
                {
                    "AttributeName": "scopedName",
                    "AttributeType": "S"
                },
                {
                    "AttributeName": "version",
                    "AttributeType": "N"
                },
                {
                    "AttributeName": "indexScope",
                    "AttributeType": "S"
                }
            ],
            "KeySchema": [
                {
                    "AttributeName": "scopedName",
                    "KeyType": "HASH"
                },
                {
                    "AttributeName": "version",
                    "KeyType": "RANGE"
                }
            ],
            "ProvisionedThroughput": {
                "ReadCapacityUnits": 1,
                "WriteCapacityUnits": 1,
            },
            "GlobalSecondaryIndexes": [
                {
                    "IndexName": scopeNameIndexName,
                    "KeySchema": [
                        {
                            "AttributeName": "indexScope",
                            "KeyType": "HASH"
                        }
                    ],
                    "Projection": {
                        "ProjectionType": "KEYS_ONLY"
                    },
                    "ProvisionedThroughput": {
                        "ReadCapacityUnits": 1,
                        "WriteCapacityUnits": 1,
                    }
                }
            ]
        }).promise();
    }

    isReady() {
        return this.ready;
    }

    private async bootstrap() {


        this.ready = true;
    }
}

let scopeNameIndexName = "ScopeNameIndex";

