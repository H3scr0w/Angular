export class TokenModel {
  constructor(
    public id: number,
    public resourceId: string,
    public sgid: string,
    public email: string,
    public creationDate: Date,
    public isExpired: boolean
  ) {}
}
