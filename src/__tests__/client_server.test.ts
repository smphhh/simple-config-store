
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {createInterfaceDescriptorFrontendProxy, HttpTransportClient} from 'simple-typed-rpc';

import {createConfig} from '../config';
import {DynamoDBDataStore} from '../data_store';
import {ConfigStore} from '../config_store';
import {KmsCrypto} from '../crypto';
import {ConfigStoreClient} from '../client';
import {Server} from '../server';
import {ConfigDataProvider} from '../service_interface';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe("Client-server integration", function () {
    let config = createConfig("test");

    let dataStore = new DynamoDBDataStore(config.dynamoDBDataStore);
    let crypto = new KmsCrypto({ region: config.region });
    let configStore = new ConfigStore(config.configStore, crypto, dataStore);
    let server = new Server({ port: 0 }, configStore);

    let port = server.getPort();

    let rpcTransportClient = new HttpTransportClient(`http://localhost:${port}/config_data_provider/rpc/`);
    let rpcProxy = createInterfaceDescriptorFrontendProxy(ConfigDataProvider, rpcTransportClient);
    let client = new ConfigStoreClient(null, crypto, rpcProxy)

    before(async function () {
    });

    beforeEach(async function() {
        await dataStore.recreateTable();
    });

    it("should allow retrieving values by scoped name", async function () {
        this.timeout(4000);

        await configStore.setScopeValue("scope1", "foo", "scope1 foo");
        await configStore.setScopeValue("scope2", "foo", "scope2 foo");

        expect(await client.getScopeValue("scope1", "foo")).to.equal("scope1 foo");
        expect(await client.getScopeValue("scope2", "foo")).to.equal("scope2 foo");
    });

});
