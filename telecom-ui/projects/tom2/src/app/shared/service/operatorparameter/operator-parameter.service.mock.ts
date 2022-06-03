import { of, Observable } from 'rxjs';
import { OperatorParameter, OperatorParameterDTO } from '../../models/operator-parameter';
import { Page } from '../../models/page.model';
import { IOperatorParameterService } from './operator-parameter.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockOperatorParameterService implements IOperatorParameterService {
  getAllOperatorParameters(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<OperatorParameterDTO>> {
    return of(null);
  }

  getOperatorParameter(id: number): Observable<OperatorParameterDTO> {
    throw new Error('Method not implemented.');
  }
  addOperatorParameter(operatorParameter: OperatorParameter): Observable<OperatorParameter> {
    throw new Error('Method not implemented.');
  }
  editOperatorParameter(operatorParameter: OperatorParameter): Observable<OperatorParameter> {
    throw new Error('Method not implemented.');
  }
  getOperatorParameterByOperatorAndLabelAndType(
    operatorId: number,
    label: string,
    type: string
  ): Observable<OperatorParameter> {
    throw new Error('Method not implemented.');
  }
}
