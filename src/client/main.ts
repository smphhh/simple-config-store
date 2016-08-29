
import {createInterfaceDescriptorFrontendProxy, HttpTransportClient} from 'simple-typed-rpc';

import {ConfigStoreClient} from './client';
import {KmsCrypto} from '../crypto';
import {ConfigDataProvider} from '../service_interface';

export function createKmsRpcConfigStoreClient(serverEndpoint: string, kmsRegion: string) {
    let rpcTransportClient = new HttpTransportClient(serverEndpoint);
    let rpcProxy = createInterfaceDescriptorFrontendProxy(ConfigDataProvider, rpcTransportClient);

    let kmsCrypto = new KmsCrypto({ region: kmsRegion });

    let client = new ConfigStoreClient(null, kmsCrypto, rpcProxy);

    return client;
}
