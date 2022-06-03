# Sirene

Saint-Gobain Sirene frontend application.

# Getting started

1. Install software [NVM, NPM and YARN](https://cerebro.digital-solutions.saint-gobain.com/delivery/docs/delivery-gitlab/blob/master/dev/angular.md)

2. Go to project folder and install dependencies:
 ```bash
 yarn install
 ```

3. Launch development server, and open `localhost:4200` in your browser:
 ```bash
 yarn start
 ```

# Project structure

```
dist/                        web app production build
docs/                        project docs and coding guides
e2e/                         end-to-end tests
mocking-server/              mocking server source code
src/                         project source code
|- app/                      app components
|  |- core/                  core module (singleton services and single-use components)
|  |- shared/                shared module  (common components, directives and pipes)
|  |- app.component.*        app root component (shell)
|  |- app.module.ts          app root module definition
|  |- app-routing.module.ts  app routes
|  +- ...                    additional modules and components
|- assets/                   app assets (images, fonts, sounds...)
|- environments/             values for various build environments
|- theme/                    app global scss variables and theme
|- translations/             translations files
|- index.html                html entry point
|- main.scss                 global style entry point
|- main.ts                   app entry point
|- polyfills.ts              polyfills needed by Angular
+- test.ts                   unit tests entry point
reports/                     test and coverage reports
proxy.conf.js                backend proxy configuration
proxy.local.conf.js          backend server proxy configuration
```

# Main tasks

Task automation is based on [NPM scripts](https://docs.npmjs.com/misc/scripts).

Task                             | Description
---------------------------------|--------------------------------------------------------------------------------------
`yarn start`                     | Run start:local and start:mock
`yarn start:local`               | Run development server on `http://localhost:4200/`
`yarn start:server`              | Run development server connected to the backend server on `http://localhost:4200/`
`yarn start:mock`                | Run the mocking server on `http://localhost:4000/`
`yarn build:uat`                 | Lint code and build web app for UAT in `dist/` folder
`yarn build:prod`                | Lint code and build web app for production in `dist/` folder
`yarn test`                      | Run unit tests via [Karma](https://karma-runner.github.io) in watch mode
`yarn run test:ci`               | Lint code and run unit tests once for continuous integration
`yarn run e2e`                   | Run e2e tests using [Protractor](http://www.protractortest.org)
`yarn run lint`                  | Lint code
`yarn run translations:extract`  | Extract strings from code and templates to `src/app/translations/template.json`
`yarn run docs`                  | Display project documentation
`yarn run reports:doc`           | Generate Javascript documentation
`yarn run reports:wp`            | Build web app for production and show Webpack report of what's really inside
`yarn run reports:open`          | Open list of reports

When building the application, you can specify the target environment using the additional flag `--env <name>` (do not
forget to prepend `--` to pass arguments to yarn scripts).

The default build environment is `prod`.

## Development server

Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.
You should not use `ng serve` directly, as it does not use the backend proxy configuration by default.

## Mocking server

### Introduction

This project use [json-server](https://github.com/typicode/json-server), and is based on [json-server-extension](https://github.com/maty21/json-server-extension).

It provide a fast an easy mocking solution for the service layer of any micro-service based project.

### configuration

The default configuration can be found in mocking-server/default.config.json. For example, by default, the server run on the port 4000.

You can override any subset of this values by creating a local.config.json file at the root your local copy of this project.

For example, to run the server on port 5200 :
```json
{
    "port": 5200
}
```

How to test it
----------------

This project provide two built in basic services, with the related mocks (in mocking-server/data) :
/hellos
/static-test

The first one is a complete REST example :
GET_ALL : GET /hellos
GET_ONE : GET /hellos/:id (the id is an int)
CREATE : POST /hellos with { message: "your message", "fibonacci": <integer> }
UPDATE : PUT /hellos/:id with { message: "your message", "fibonacci": <integer> }
DELETE : DEL /hellos/:id

How to had new mocks
--------------------

You can create new mocks via two solutions : static (json) mocks, or generators.

Any of the following concepts are based on [json-server](https://github.com/typicode/json-server). Therefor, any information you could get from its documentation should be
relevant for this project too.

For example, if you want to permit to make a "get single" from an id (ex: /objects/12), you should define an 'id' attribute on the related data.

### static mocks

Create a new '<any-string-you-want>.mock.json' file in './mocking-server/data/' or any subfolder.

Your json file should look like this :

```json
{
    "service-name": <your data (array or object)>
}
```

As soon as you'll restart the server, a new REST entry will be available at http://localhost:4000/service-name

For more informations on how to write your mock, see [the json-server example](https://github.com/typicode/json-server#example), and documentation.
We simply permit to split the "db.json" file in multiple files. Any of your "*.mock.json" file could be a subset of the examples you could find from json-server.

Also look at ./mocking-server/data/tests/static-test.mock.json to see another example.

### Generators

Create a new '<any-string-you-want>.generator.ts' file in './mocking-server/data/' or any subfolder.

This ts file should export to its 'default' a "genarator function" :
    ``export default <generator function>``

To know how to write this "generator function", see [following example](https://github.com/maty21/json-server-extension#generator-example), or mocking-server/data/hellos/hellos.generator.ts

## Code scaffolding

Run `yarn run generate component <name>` to generate a new component. You can also use
`yarn run generate directive|pipe|service|class|module`.

If you have installed [angular-cli](https://github.com/angular/angular-cli) globally with `yarn install -g @angular/cli`,
you can also use the command `ng generate` directly.

## Additional tools

Tasks are mostly based on the `angular-cli` tool. Use `ng help` to get more help or go check out the
[Angular-CLI README](https://github.com/angular/angular-cli).

# What's in the box

The app template is based on [HTML5](http://whatwg.org/html), [TypeScript](http://www.typescriptlang.org) and
[Sass](http://sass-lang.com). The translation files use the common [JSON](http://www.json.org) format.

#### Tools

Development, build and quality processes are based on [angular-cli](https://github.com/angular/angular-cli) and
[NPM scripts](https://docs.npmjs.com/misc/scripts), which includes:

- Optimized build and bundling process with [Webpack](https://webpack.github.io)
- [Development server](https://webpack.github.io/docs/webpack-dev-server.html) with backend proxy and live reload
- Cross-browser CSS with [autoprefixer](https://github.com/postcss/autoprefixer) and
  [browserslist](https://github.com/ai/browserslist)
- Asset revisioning for [better cache management](https://webpack.github.io/docs/long-term-caching.html)
- Unit tests using [Jasmine](http://jasmine.github.io) and [Karma](https://karma-runner.github.io)
- End-to-end tests using [Protractor](https://github.com/angular/protractor)
- Static code analysis: [TSLint](https://github.com/palantir/tslint), [Codelyzer](https://github.com/mgechev/codelyzer),
  [Stylelint](http://stylelint.io) and [HTMLHint](http://htmlhint.com/)

#### Libraries

- [Angular](https://angular.io)
- [Bootstrap 4](https://getbootstrap.com)
- [ng-bootsrap](https://ng-bootstrap.github.io/)
- [Font Awesome](http://fontawesome.io)
- [RxJS](http://reactivex.io/rxjs)
- [ngx-translate](https://github.com/ngx-translate/core)
- [Lodash](https://lodash.com)

#### Coding guides

See [here](https://cerebro.digital-solutions.saint-gobain.com/delivery/delivery-gitlab#frontend-coding-guide)

#### Other documentation

- [I18n guide](docs/i18n.md)
- [Working behind a corporate proxy](docs/corporate-proxy.md)
- [Updating dependencies and tools](docs/updating.md)
- [Using a backend proxy for development](docs/backend-proxy.md)
- [Browser routing](docs/routing.md)
