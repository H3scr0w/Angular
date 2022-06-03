import { Catalog } from './catalog';
import { Operator } from './operators';

export class CatalogVersion {
  constructor(
    public id: number = 0,
    public catalog: Catalog = new Catalog(),
    public status: boolean = false,
    public catalogVersion: string = '',
    public filename: string = '',
    public lastUpdate: Date = new Date(),
    public comments: string = '',
    public sgnet: string = ''
  ) {}
}

export class CatalogVersionFilter extends CatalogVersion {
  constructor(public operator: Operator = null) {
    super();
  }
}
