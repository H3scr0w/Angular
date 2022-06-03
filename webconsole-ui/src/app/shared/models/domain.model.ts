import { DomainType } from 'src/app/shared/models/domain-type';

export class Domain {
  /* Principal */
  code: string;
  domainType: DomainType;
  parent: Domain;
  children: Domain[];
  name: string;
  websiteCode: string;
  docrootCode: string;
  environmentCode: string;
  registarCode: string;
  registarName: string;
  httpsEnable: boolean;
  /* Authentication */
  realm: string;
  user: string;
  password: string;
  useDocrootEnvAuth: boolean;
  isBasicAuth: boolean;
  /* Qualys */
  isQualysEnable: boolean;
  qualysWebAppId: number;
  qualysWebAuthId: string;
  /* WAF */
  wafId: string;
  /* Monitoring */
  isMonitorEnable: boolean;
  monitorKeyword: string;
}
