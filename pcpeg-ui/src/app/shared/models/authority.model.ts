import { FacilityModel } from './facility.model';

export class AuthorityModel {
  constructor(
    public id: number = 0,
    public name?: string,
    public firstname?: string,
    public sgid?: string,
    public category?: string,
    public year?: string,
    public email?: string,
    public telephone?: string,
    public facility?: FacilityModel
  ) {}
}
