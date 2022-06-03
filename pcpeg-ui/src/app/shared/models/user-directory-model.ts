export class UserDirectoryModel {
  constructor(
    public stGoSGI: string,
    public givenName: string,
    public sn: string,
    public cn: string,
    public mail: string,
    public telephoneNumber: string
  ) {}
}
