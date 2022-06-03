import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Contract, ContractDTO } from '../../models/contracts';
import { Page } from '../../models/page.model';
import { IContractService } from './contract.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockContractService implements IContractService {
  getAllContract(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    contractFilter?: ContractDTO
  ): Observable<Page<ContractDTO>> {
    return of(null);
  }
  getContract(id: number): Observable<ContractDTO> {
    throw new Error('Method not implemented.');
  }
  addContract(contract: Contract): Observable<Contract> {
    throw new Error('Method not implemented.');
  }
  editContract(contract: Contract): Observable<Contract> {
    throw new Error('Method not implemented.');
  }
  deleteContract(id: number): Observable<Contract> {
    throw new Error('Method not implemented.');
  }
}
