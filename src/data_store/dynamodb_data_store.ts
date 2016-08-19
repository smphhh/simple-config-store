
let AWS = require('AWS');

import {DataStore} from './interface';

export interface Config {
    region: string;
    endpoint: string;
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

    }

    async getValue(key: string) {
        return "a";
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
