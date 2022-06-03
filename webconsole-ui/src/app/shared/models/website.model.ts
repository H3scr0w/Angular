import { Project } from './project.model';

export class Website extends Project {
  websiteId: number;
  websiteVersion: string;
  websiteName: string;
  code: string;
  codeRepositoryUrl: string;
  binaryRepositoryUrl: string;
  homeDirectory: string;
  enable: boolean;
  name: string;
  qualysWebAppId: number;
  isQualysEnable: boolean;
  isLive: boolean;
}
