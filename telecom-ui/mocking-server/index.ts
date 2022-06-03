import { start } from './messages';
import { JsonExtender } from './extender';
import * as paths from './paths';
import { existsSync } from 'fs';

import JsonServer = require('json-server');

const defaultConfig = require('./default.config.json');

let localConfig;

if (existsSync(paths.localConfig)) {
    localConfig = require(paths.localConfig) || {};
}

const config = Object.assign(defaultConfig, localConfig);

const jsonExtension = new JsonExtender({
    filePath: paths.dbFile,
    generatedPath: paths.generatedFolder,
    staticFiles: ['./data/**/*.mock.json'],
});

jsonExtension.register('./data/**/*.generator.ts')
    .then((data) => {

        const server = JsonServer.create();
        const router = JsonServer.router(paths.dbFile);
        const middlewares = JsonServer.defaults();

        server.use(function(req, res, next){
            setTimeout(next, 1000);
          });

        server.use(middlewares);
        server.use(router);

        server.listen(config.port, () => {
            console.log(start(config.port));
        });

    })
    .catch((e) => { console.log(e); });
