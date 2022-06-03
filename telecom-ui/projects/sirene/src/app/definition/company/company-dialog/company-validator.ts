import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company, CompanyFilter, CompanyService } from '../../../shared';

export class CompanyValidator {
  static validateCompanySifcodeNotTaken(companyService: CompanyService, sifCode: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let companies: Company[] = [];
        const companyFilter: CompanyFilter = new CompanyFilter();
        companyFilter.sifCode = c.value;
        companyFilter.showArchived = true;
        return companyService.getAllCompanies('', 0, 10, '', 'asc', companyFilter).pipe(
          map(res => {
            if (res.content) {
              companies = res.content;
              if (sifCode) {
                companies = res.content.filter(company => {
                  return company.sifCode !== sifCode;
                });
              }
              return companies.filter(company => company.sifCode.toLowerCase().trim() === c.value.toLowerCase().trim())
                .length === 0
                ? null
                : { companyIdNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }

  static validateCompanyNameNotTaken(companyService: CompanyService, companyName: string) {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let companies: Company[] = [];
        const companyFilter: CompanyFilter = new CompanyFilter();
        companyFilter.companyName = c.value;
        return companyService.getAllCompanies('', 0, 10, '', 'asc', companyFilter).pipe(
          map(res => {
            if (res.content) {
              companies = res.content;
              if (companyName) {
                companies = res.content.filter(company => {
                  return company.companyName !== companyName;
                });
              }
              return companies.filter(
                company => company.companyName.toLowerCase().trim() === c.value.toLowerCase().trim()
              ).length === 0
                ? null
                : { companyNameNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
