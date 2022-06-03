export class CompanyModel {
  constructor(
    public societeSid: number = 0,
    public societeLibelle: string,
    public codeSif: string,
    public codeAmundi: string,
    public comments: string,
    public flagAdherente: boolean = false,
    public cspId: string
  ) {}
}
