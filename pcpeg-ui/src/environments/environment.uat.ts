// `.env.ts` is generated by the `npm run env` command
import { env } from './.env';
import { environment as defaultEnvironment } from './environment.default';

/**
 * The environment variables
 */
export const environment = {
  ...defaultEnvironment,
  production: true,
  version: env.npm_package_version,
  clientId: '59b17c05-bd44-46e5-8e8e-1ce97044df29',
  clientSecret: 'c83695f4-080c-43a2-b1a5-4f347199c3c1'
};
