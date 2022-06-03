import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Contract, ContractDTO } from '../../models/contracts';
import { Page } from '../../models/page.model';

export interface IContractService {
  getAllContract(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    contractFilter?: ContractDTO
  ): Observable<Page<ContractDTO>>;

  getContract(id: number): Observable<ContractDTO>;

  addContract(Contract: Contract): Observable<Contract>;

  editContract(Contract: Contract): Observable<Contract>;

  deleteContract(id: number): Observable<Contract>;
}

@Injectable({
  providedIn: 'root'
})
export class ContractService implements IContractService {
  private url = '/contracts';

  constructor(private http: HttpClient) {}

  getAllContract(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    contractFilter?: ContractDTO
  ): Observable<Page<ContractDTO>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (contractFilter) {
      if (contractFilter.skip) {
        params = params.set('skip', '' + contractFilter.skip);
      } else {
        params = params.set('isAdvanceFilter', '' + 'true');
      }
      if (contractFilter.code) {
        params = params.set('code', '' + contractFilter.code.trim());
      }
      if (contractFilter.operator != null && contractFilter.operator.id) {
        params = params.set('operatorId', '' + contractFilter.operator.id);
      }
    }

    return this.http.get<Page<ContractDTO>>(this.url, { params });
  }

  getContract(id: number): Observable<ContractDTO> {
    return this.http.get<ContractDTO>(this.url + '/' + id);
  }

  addContract(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(this.url, contract);
  }

  editContract(contract: Contract): Observable<Contract> {
    return this.http.put<Contract>(this.url + '/' + contract.id, contract);
  }

  deleteContract(id: number): Observable<Contract> {
    return this.http.delete<Contract>(this.url + '/' + id);
  }
}
