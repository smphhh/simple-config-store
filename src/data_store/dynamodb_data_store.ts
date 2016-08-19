
let AWS = require('aws-sdk');

import {DataStore} from './interface';

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

    async setValue(key: string, value: string) {
        let response = await this.docClient.put({
            TableName: this.config.tableName,
            Item: {
                key: key,
                version: 1,
                value: value
            }
        }).promise();
    }

    async getValue(key: string) {
        let response = await this.docClient.get({
            TableName: this.config.tableName,
            Key: {
                key: key,
                version: 1
            }
        }).promise();

        return response.Item.value as string;
    }

    isReady() {
        return this.ready;
    }

    private async bootstrap() {


        this.ready = true;
    }
}

let createTableParams = {
    "AttributeDefinitions": [
        {
            "AttributeName": "key",
            "AttributeType": "S"
        },
        {
            "AttributeName": "version",
            "AttributeType": "N"
        }
    ],
    "ProvisionedThroughput": {
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
    },
    "KeySchema": [
        {
            "AttributeName": "key",
            "KeyType": "HASH"
        },
        {
            "AttributeName": "version",
            "KeyType": "RANGE"
        }
    ],
    "TableName": "ConfigStore"
};
