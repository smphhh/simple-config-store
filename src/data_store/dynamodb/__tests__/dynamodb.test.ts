import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {DynamoDBDataStore} from '../dynamodb_data_store';

chai.use(chaiAsPromised);

let expect = chai.expect;

describe("DynamoDB data store", function () {

    let dataStore = new DynamoDBDataStore({
        region: "eu-west-1",
        endpoint: "http://localhost:8000",
        tableName: "test-ConfigStore"
    });

    beforeEach(async function() {
        await dataStore.recreateTable();
    });

    it("should allow storing and retrieving scoped values", async function () {
        await dataStore.setScopeValue("scope1", "foo", "scope1 foo");
        await dataStore.setScopeValue("scope1", "bar", "scope1 bar");
        await dataStore.setScopeValue("scope2", "foo", "scope2 foo");

        let scope1Foo = await dataStore.getScopeValue("scope1", "foo");

        expect(scope1Foo).to.equal("scope1 foo");
    });

    it("should allow updating values", async function () {
         await dataStore.setScopeValue("scope1", "foo", "foo:1");
         expect(await dataStore.getScopeValue("scope1", "foo")).to.equal("foo:1");
         
         await dataStore.setScopeValue("scope1", "foo", "foo:2");
         expect(await dataStore.getScopeValue("scope1", "foo")).to.equal("foo:2");
    });

    it("should allow retrieving all values within a scope", async function () {
        await dataStore.setScopeValue("scope1", "foo", "scope1 foo");
        await dataStore.setScopeValue("scope1", "bar", "scope1 bar");
        await dataStore.setScopeValue("scope2", "foo", "scope2 foo");

        expect(await dataStore.getAllScopeValues("scope1")).to.deep.equal({
            foo: "scope1 foo",
            bar: "scope1 bar"
        });

        expect(await dataStore.getAllScopeValues("scope2")).to.deep.equal({
             foo: "scope2 foo"
        });
    });

    it("should allow retrieving all values within a scope after an update", async function () {
        await dataStore.setScopeValue("scope1", "foo", "scope1 foo:1");
        await dataStore.setScopeValue("scope1", "bar", "scope1 bar:1");

        expect(await dataStore.getAllScopeValues("scope1")).to.deep.equal({
            foo: "scope1 foo:1",
            bar: "scope1 bar:1"
        });

        await dataStore.setScopeValue("scope1", "foo", "scope1 foo:2");
        await dataStore.setScopeValue("scope1", "bar", "scope1 bar:2");

        expect(await dataStore.getAllScopeValues("scope1")).to.deep.equal({
            foo: "scope1 foo:2",
            bar: "scope1 bar:2"
        });
    });

});
