import { Domain } from './domain.model';

export class Environment {
  environmentId: string;
  code: string;
  name: string;
  environmentCode: string;
  websiteVersion: string;
  cmsVersion: string;
  cmsCode: string;
  cmsName: string;
  domains: Domain[];

  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }
}
