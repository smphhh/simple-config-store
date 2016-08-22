
import {createConfig} from './config'

import {DynamoDBDataStore} from './data_store';
import {ConfigStore} from './config_store';
import {KmsCrypto} from '../common/crypto';
import {Server} from './server';

let config = createConfig(process.env['CONFIG_NAME'] || 'production');

let dataStore = new DynamoDBDataStore(config.dynamoDBDataStore);

let crypto = new KmsCrypto({
    region: config.region
});

let configStore = new ConfigStore(config.configStore, crypto, dataStore);

let server = new Server(config.server, configStore);
