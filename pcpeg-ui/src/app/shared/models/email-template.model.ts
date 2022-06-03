export class EmailTemplateModel {
  constructor(
    public objetInitial: string,
    public objetRelance: string,
    public mailInitial: string,
    public mailRelance: string,
    public formulaireDateLimiteReponse: Date
  ) {}
}
