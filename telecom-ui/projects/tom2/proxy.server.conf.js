'use strict';

const HttpsProxyAgent = require('https-proxy-agent');

/*
 * API proxy configuration.
 * This allows you to proxy HTTP request like `http.get('/api/stuff')` to another server/port.
 * This is especially useful during app development to avoid CORS issues while running a local server.
 * For more details and options, see https://github.com/angular/angular-cli#proxy-to-backend
 */
const proxyConfig = [
  {
    context: '/api/toolbox',
    pathRewrite: { '^/api': '' },
    target: 'https://lan.api.saint-gobain.com/sgdsi/test',
    changeOrigin: true,
    secure: false
  },
  {
    context: '/api/sgdsi/lan/oauth/uat/saml',
    pathRewrite: { '^/api': '' },
    target: 'https://lan.api.saint-gobain.com',
    changeOrigin: true,
    secure: false
  },
  {
    context: '/api/sgdsi/token',
    pathRewrite: { '^/api/sgdsi/token': '/sgdsi/test/token' },
    target: 'https://lan.api.saint-gobain.com',
    changeOrigin: true,
    secure: false
  },
  {
    context: '/api/common',
    pathRewrite: { '^/api/common': '' },
    target: 'https://sisgt-common.uat.c1.api.dps.saint-gobain.com',
    changeOrigin: true,
    secure: false
  },
  {
    context: '/api/sirene',
    pathRewrite: { '^/api/sirene': '' },
    target: 'https://sirene.uat.c1.api.dps.saint-gobain.com',
    changeOrigin: true,
    secure: false
  },
  {
    context: '/api/spo',
    pathRewrite: { '^/api/spo': '' },
    target: 'https://spo.uat.c1.api.dps.saint-gobain.com',
    changeOrigin: true,
    secure: false
  },
  {
    context: '/api/tempo',
    pathRewrite: { '^/api/tempo': '' },
    target: 'https://tempo.uat.c1.api.dps.saint-gobain.com',
    changeOrigin: true,
    secure: false
  },
  {
    context: '/api',
    pathRewrite: { '^/api': '' },
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false
  }
];

/*
 * Configures a corporate proxy agent for the API proxy if needed.
 */
function setupForCorporateProxy(proxyConfig) {
  if (!Array.isArray(proxyConfig)) {
    proxyConfig = [proxyConfig];
  }

  const proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  let agent = null;

  if (proxyServer) {
    console.log(`Using corporate proxy server: ${proxyServer}`);
    agent = new HttpsProxyAgent(proxyServer);
    proxyConfig.forEach(entry => { entry.agent = agent; });
  }

  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
