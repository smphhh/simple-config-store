
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {createConfig} from '../../config';
import {KmsCrypto} from '../kms_crypto';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe("KmsCrypto", function () {

    let config = createConfig("test");

    let crypto = new KmsCrypto({ region: config.region });

    let masterKeyId = config.configStore.masterKeyId;
    let scope1KeyId = config.configStore.scopeKeyIds.get("scope1");

    it("should encrypt and decrypt JSON-serializable data using the master key", async function () {
        let data = {
            a: 1,
            bar: [2, "b"]
        };

        let context = "foo";

        let ciphertextBlob = await crypto.encryptJsonData(data, masterKeyId, context);

        let decryptedData = await crypto.decryptJsonData(ciphertextBlob, context);

        expect(decryptedData).to.deep.equal(data);
    });

    it("should decrypt re-encrypted JSON-serializable data using a scope key", async function () {
        let data = "some string";

        let context = "foo";

        let ciphertextBlob = await crypto.encryptJsonData(data, masterKeyId, context);
        let clientCiphertextBlob = await crypto.reEncryptJsonData(ciphertextBlob, scope1KeyId, context, context);

        let decryptedData = await crypto.decryptJsonData(clientCiphertextBlob, context);

        expect(decryptedData).to.deep.equal(data);
    });

});