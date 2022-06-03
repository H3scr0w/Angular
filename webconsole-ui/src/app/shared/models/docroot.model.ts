import { Environment } from './environment.model';

export class Docroot {
  code: string;
  name: string;
  rundeckJobApiUrl: string;
  hostingProviderCode: string;
  hostingProviderName: string;
  environments: Environment[];
  providerInternalId: string;

  constructor(code: string, name: string, rundeckJobApiUrl: string, hostingProviderCode: string) {
    this.name = name;
    this.code = code;
    this.rundeckJobApiUrl = rundeckJobApiUrl;
    this.hostingProviderCode = hostingProviderCode;
  }
}
