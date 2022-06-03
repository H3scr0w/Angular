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

    server.use(function (req, res, next) {
      setTimeout(next, 1000);
    });


    server.use(function (req, res, next) {
      if (req.query.page) {
        req.query._page = req.query.page;
        delete req.query.page;
      }
      if (req.query.size) {
        req.query._limit = req.query.size;
        delete req.query.size;
      }
      if (req.query.sort) {
        const sort = req.query.sort.split(',');
        req.query._sort = sort[0];
        req.query._order = sort[1];
        delete req.query.sort;
      }
      next()
    });

    server.use(middlewares);
    server.use(router);

    server.listen(config.port, () => {
      console.log(start(config.port));
    });

  })
  .catch((e) => {
    console.log(e);
  });
