export class FacilityModel {
  constructor(
    public facilityId?: string,
    public facilityLabel?: string,
    public isActive?: string,
    public codeSif?: string,
    public companyLabel?: string
  ) {}
}

export class FacilityFilter extends FacilityModel {
  constructor(public active?: boolean, public societeSid?: number) {
    super();
  }
}
