import { Project } from './project.model';
export class DocrootCore extends Project {
  code: string;
  name: string;
  codeRepositoryUrl: string;
  binaryRepositoryUrl: string;

  constructor(code: string, name: string, codeRepositoryUrl: string, binaryRepositoryUrl: string) {
    super();
    this.code = code;
    this.name = name;
    this.codeRepositoryUrl = codeRepositoryUrl;
    this.binaryRepositoryUrl = binaryRepositoryUrl;
  }
}
