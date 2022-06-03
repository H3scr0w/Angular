import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Company, CompanyFilter } from '../../models/company';
import { CompanyHome } from '../../models/company-home';
import { Page } from '../../models/page.model';
import { ICompanyService } from './company.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockCompanyService implements ICompanyService {
  getCompanyById(sifCode: string): Observable<Company> {
    throw new Error('Method not implemented.');
  }

  getAllCompaniesSiteCount(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<CompanyHome>> {
    return of(null);
  }

  getAllCompanies(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    companyFilter?: CompanyFilter
  ): Observable<Page<Company>> {
    return of(null);
  }
}
