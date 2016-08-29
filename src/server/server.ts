
let bodyParser = require('body-parser');
import * as express from 'express';
import * as http from 'http';

import {createExpressResolver, createInterfaceDescriptorBackendProxy} from 'simple-typed-rpc';

import {ConfigDataProvider} from '../service_interface';

export interface Config {
    port: number;
}

export class Server {
    private app: express.Application;
    private server: http.Server;

    constructor(
        private config: Config,
        private configDataProvider: ConfigDataProvider
    ) {
        let app = this.app = express();

        app.use(bodyParser.json());

        // Health check
        app.get('/health/', function (req, res) {
            res.send("ok");
        });

        app.post('/config_data_provider/rpc/', createExpressResolver(createInterfaceDescriptorBackendProxy(ConfigDataProvider, configDataProvider)));

        app.get('/config_data_provider/rest', function (request, response) {
            response.send("not_implemented");
        });

        this.server = app.listen(this.config.port, () => {
            var host = this.server.address().address;
            var port = this.server.address().port;

            console.log('Example app listening at http://%s:%s', host, port);
        });

        console.log(this.server.address());
    }

    getPort() {
        return this.server.address().port;
    }

}
