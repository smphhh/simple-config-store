import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as nodeFetch from 'node-fetch';
import * as TypeMoq from 'typemoq';

import { ConfigDataProvider } from '../../service_interface';

import { Server } from '../';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe("Config data provider REST api", function () {
    let configStoreProviderMock = TypeMoq.Mock.ofType(ConfigDataProvider);

    let server = new Server({ port: 0 }, configStoreProviderMock.object);
    let port = server.getPort();

    it("should return all scope values", async function () {
        let scopeData = {
            encryptedValues: { foo: "bar" }
        };

        configStoreProviderMock.setup(x => x.getAllScopeEncryptedValues("scope1")).returns(() => Promise.resolve(scopeData))

        let response = await nodeFetch(`http://localhost:${port}/config_data_provider/rest/all-scope-values/?scope=scope1`);
        let data = await response.json();

        expect(data).to.deep.equal(scopeData);
    });

});

