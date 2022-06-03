import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { CsvParameter } from '../../models/csv-parameter';
import { Page } from '../../models/page.model';
import { ICsvParameterService } from './csv-parameter.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockCsvParameterService implements ICsvParameterService {
  getAllCsvParameter(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<CsvParameter>> {
    return of(null);
  }

  addCsvParameter(csvParameter: CsvParameter): Observable<CsvParameter> {
    throw new Error('Method not implemented.');
  }
}
