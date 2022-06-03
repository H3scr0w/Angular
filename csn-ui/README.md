# FrontendCaf

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.2.

## Build status

[![build status](https://git.sedona.fr/Images/java/badges/master/build.svg)](https://git.sedona.fr/Images/java/commits/master)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Building the image and running the container

First build the project :

```bash
ng build --prod
```

## Docker

Now we're just two commands away from having a running instance of our server. First we'll need to build our container. From our repo root we can call docker build like this.

```bash
docker build -t registry.sedona.fr/csn/caf/frontend .
```

## Run it

```bash
docker run -dit --name=frontend-caf  -p 8080:80 -p8443:443 registry.sedona.fr/csn/caf/frontend
```

## Connect to the container

```bash
docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS              PORTS                  NAMES
cd5096d53c4a        frontend-caf        "/usr/share/bin/dock…"   About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp   frontend-caf
docker exec -ti cd5096d53c4a bash
```

This command is fairly straight forward, the -t (--tag) flag lets you set the name and tag for the image and it takes a single argument of path containing a Dockerfile.

You should see docker working in the terminal, what it's doing is downloading all the dependent images that our new image will be based on, as mentioned previously the layered filesystem, allows each image to be comprised of it's changes to it's parent image. This helps keep image sizes small and allows us to utilize caching to speed up our container builds.

Once docker build is completes the only thing left to do is run our image as a container, with the docker run command. Docker run offers a variety of command flags that allow us to set important options at run time. Let's take the following command.

```bash
docker run -dit --name frontend-caf  -p 8080:80  -p8443:443 -v `pwd`/dist/frontend-caf:/usr/local/apache2/htdocs registry.sedona.fr/csn/caf/frontend
```

## DockerCompose

### Run it

```bash
docker-compose up
```

Try http://localhost:8080 and http://localhost:8443 in your favorite browser.

### Stop it

type ctrl/c and:

```bash
docker-compose down
```

### Use the image with environment variables

| Variable                 | Default                                                            | Comment                           |
|--------------------------|--------------------------------------------------------------------|-----------------------------------|
| SERVER_NAME              | 'www.csn.com'                                                      | Name of the http server           |
| SERVER_ADMIN             | 'sedona@sedona.fr'                                                 | Mail of the server admin          |
| DOCUMENT_ROOT            | '/var/www/csn'                                                     | Directory whe the app is deployed |
| OIDC_SSL_VALIDATE_SERVER | 'Off'                                                              | Enable SSL certificat validation  |
| OIDC_ISSUER              | 'https://www.idnot.notaires.fr'                                    | Open Id connect Issuer            |
| OIDC_AUTHORIZE_ENDPOINT  | 'https://qual-connexion.idnot.fr/IdPOAuth2/auth/IDNOT_IDP'         | OIDC Authorize endpoint           |
| OIDC_JWKS_URL            | 'https://qual-connexion.idnot.fr/IdPOAuth2/jwk/IDNOT_IDP'          | OIDC JWKS url                     |
| OIDC_TOKEN_ENDPOINT      | 'https://qual-connexion.idnot.fr/IdPOAuth2/token/IDNOT_IDP'        | OIDC Token endpoint               |
| OIDC_TOKEN_ENDPOINT_AUTH | 'client_secret_basic'                                              | OIDC Token endpoint auth          |
| OIDC_USER_INFO_ENDPOINT  | 'https://qual-connexion.idnot.fr/IdPOAuth2/userinfo/IDNOT_IDP'     | OIDC user info endpoint           |
| OIDC_CLIENT_ID           | '61D3CC5E3A83957D'                                                 | OIDCC client id                   |
| OIDC_CLIENT_SECRET       | '4000DFA5DEAED3F2C66064492D3DD38F8A94CF42701E2E770582F585EC36DE73' | OIDCC client secret               |
| OIDC_REDIRECT_URI        | '4bc7b9d3.ngrok.io'                                                | OIDC redirect uri                 |
| OIDC_PASSWORD            | '0123456789'                                                       | OIDC passphrase                   |
| API_HOST                 | 'backend'                                                          | API host                          |
| API_HTTP_PORT            | '9000'                                                             | API HTTP port                     |
| API_HTTPS_PORT           | '9443'                                                             | API HTTPS PORT                    |
| SSL_CERTIFICAT_FILE      | '/etc/https/apache-server.crt'                                     | SSL certficat file                |
| SSL_CERTIFICAT_KEY_FILE  | '/etc/https/apache-server.key'                                     | SSL certificat key                |
| BACK_OFFICE_BASE_PATH    | 'https://back-office.csn.dev.sedona.fr:444'                        | Back-office url                   |

```bash
docker run -dit --name=frontend  -e OIDC_ISSUER=oidc-issuer ... -p 9000:9000 frontend
```
