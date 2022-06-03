import { of, Observable } from 'rxjs';
import { AcnParameter, AcnParameterDTO } from '../../models/acn-parameter';
import { Page } from '../../models/page.model';
import { IAcnParameterService } from './acn-parameter.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockAcnParameterService implements IAcnParameterService {
  getAllAcnParameters(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<AcnParameterDTO>> {
    return of(null);
  }

  getAcnParameter(id: number): Observable<AcnParameter> {
    throw new Error('Method not implemented.');
  }
  addAcnParameter(acnParameter: AcnParameter): Observable<AcnParameter> {
    throw new Error('Method not implemented.');
  }
  editAcnParameter(acnParameter: AcnParameter): Observable<AcnParameter> {
    throw new Error('Method not implemented.');
  }
  getAcnParameterByNetworkAndAcn(networkId: number, acn: string): Observable<AcnParameter> {
    throw new Error('Method not implemented.');
  }
}
