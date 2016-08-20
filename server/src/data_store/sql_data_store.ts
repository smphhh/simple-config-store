
import * as knex from 'knex';

import {DataStore} from './interface';

export class SqlDataStore implements DataStore {
    constructor(
        private knexClient: knex
    ) {
    }

    async setValue(key: string, value: string) {
        
    }

    async getValue(key: string) {
        return "a";
    }
}
