
import * as dev from './dev';
import * as production from './production';
import * as test from './test';

export function createConfig(configName: string) {
    if (configName === 'dev') {
        return dev.create();
    } else if (configName === 'production') {
        return production.create();
    } else if (configName === 'test') {
        return test.create();
    } else {
        throw new Error(`Invalid config name: ${configName}`);
    }
}
