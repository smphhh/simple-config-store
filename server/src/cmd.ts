
const vorpal = require('vorpal')();

import {createConfig} from './config'

import {DynamoDBDataStore} from './data_store';
import {ConfigStore} from './config_store';
import {KmsCrypto, StubCrypto} from './crypto';
import {Server} from './server';

let config = createConfig(process.env['CONFIG_NAME'] || 'dev');

let dataStore = new DynamoDBDataStore(config.dynamoDBDataStore);

let crypto = new KmsCrypto({
    region: config.region
});

let configStore = new ConfigStore(config.configStore, crypto, dataStore);

vorpal
    .command('set <scope> <key> <value>')
    .action(async function(args) {
        let scope = args.scope;
        let key = args.key;
        let value = args.value;

        await configStore.putValue(scope, key, value);
    });

vorpal
    .command('get <scope> <key>')
    .action(async function(args) {
        let scope = args.scope;
        let key = args.key;
        
        let value = await configStore.getValue(scope, key);

        this.log(value);
    });

vorpal
    .command('get-encypted <scope> <key>')
    .action(async function(args) {
        let scope = args.scope;
        let key = args.key;
        
        let value = await configStore.getScopeEncryptedValue(scope, key);

        this.log(value);
    });

vorpal
    .command('scope [value]')
    .action(async function(args) {
        let scope = args.value;

        vorpal.delimiter(`${scope}:`);
    });

vorpal
    .delimiter('config-store:')
    .show();
