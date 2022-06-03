import { Catalog } from './catalog';
import { CatalogOptions } from './catalog-options';
import { Contract } from './contracts';
import { Operator } from './operators';

export class TelecomServiceDetail {
  constructor(
    public id: number = null,
    public operator: Operator = null,
    public contract: Contract = null,
    public catalog: Catalog = null,
    public catalogVersion: string = '',
    public serviceTitle: string = '',
    public mainServiceCode: string = '',
    public backupServiceCode: string = '',
    public options: CatalogOptions[] = [],
    public optionsCSV: string = '',
    public routerCode1: string = '',
    public routerCode2: string = ''
  ) {}
}
