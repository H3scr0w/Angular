export class CampaignIdModel {
  constructor(public societeSid: number = 0, public anneeId: number = 0, public formulaireId: number = 0) {}
}

export class CampaignModel {
  constructor(
    public id?: CampaignIdModel,
    public societeLibelle?: string,
    public codeSif?: string,
    public correspondantActuelId: number = 0,
    public correspondantActuelSgid?: string,
    public correspondantActuelNom?: string,
    public correspondantActuelPrenom?: string,
    public correspondantPrecedentId: number = 0,
    public correspondantPrecedentSgid?: string,
    public correspondantPrecedentNom?: string,
    public correspondantPrecedentPrenom?: string,
    public dateDernierMail?: Date,
    public flagEnvoieMail: boolean = false,
    public flagRelanceMail: boolean = false,
    public statutId: number = 0,
    public statutLibelle?: string,
    public flagEnCours: boolean = false
  ) {}
}

export class CampaignFilter extends CampaignModel {
  constructor(public year?: string) {
    super();
  }
}
