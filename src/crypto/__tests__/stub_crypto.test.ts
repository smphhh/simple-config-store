
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {StubCrypto} from '../stub_crypto';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe("StubCrypto", function () {

    let crypto1 = new StubCrypto({
        a: 'b',
        c: 'd'
    });

    it("should encrypt and decrypt JSON-serializable data", async function () {
        let data = {
            a: 1,
            bar: [2, "b"]
        };

        let ciphertextBlob = await crypto1.encryptJsonData(data, 'a');

        let decryptedData = await crypto1.decryptJsonData(ciphertextBlob);

        expect(decryptedData).to.deep.equal(data);
    });

});