import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { LtcTermination, LtcTerminationDTO } from '../../models/ltc-termination';
import { Page } from '../../models/page.model';
import { ILtcTerminationService } from './ltc-termination.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockLtcTerminationService implements ILtcTerminationService {
  getAllLtcTermination(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    ltcTerminationFilter?: LtcTerminationDTO
  ): Observable<Page<LtcTerminationDTO>> {
    return of(null);
  }
  getLtcTermination(id: number): Observable<LtcTerminationDTO> {
    throw new Error('Method not implemented.');
  }
  addLtcTermination(ltcTermination: LtcTermination): Observable<LtcTermination> {
    throw new Error('Method not implemented.');
  }
  editLtcTermination(ltcTermination: LtcTermination): Observable<LtcTermination> {
    throw new Error('Method not implemented.');
  }
  deleteLtcTermination(id: number): Observable<LtcTermination> {
    throw new Error('Method not implemented.');
  }
  getLtcTerminationByOperatorAndCatalog(operatorId: number, catalogId: number): Observable<LtcTermination> {
    throw new Error('Method not implemented.');
  }
}
