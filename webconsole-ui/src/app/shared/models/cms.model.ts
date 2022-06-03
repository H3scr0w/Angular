export class Cms {
  code: string;
  name: string;
  codeRepositoryUrl: string;
  binaryRepositoryUrl: string;

  constructor(code: string, name: string, codeRepositoryUrl: string, binaryRepositoryUrl: string) {
    this.code = code;
    this.name = name;
    this.codeRepositoryUrl = codeRepositoryUrl;
    this.binaryRepositoryUrl = binaryRepositoryUrl;
  }
}
