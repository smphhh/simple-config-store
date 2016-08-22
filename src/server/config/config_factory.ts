
import * as dev from './dev';
import * as production from './production';

export function createConfig(configName: string) {
    if (configName === 'dev') {
        return dev.create();
    } else if (configName === 'production') {
        return production.create();
    } else {
        throw new Error(`Invalid config name: ${configName}`);
    }
}
