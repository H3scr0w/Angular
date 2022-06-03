import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import {
  ActiveCommandDTO,
  CancellationDTO,
  Commands,
  CommandsDTO,
  CommandsFilter,
  OrderItem,
  OrderOperatorItem
} from '../../models/commands';
import { Contact } from '../../models/contact';
import { IEmailNotifyDTO } from '../../models/email-notify';
import { EmailOrderDTO } from '../../models/email-order.dto';
import { Page } from '../../models/page.model';
import { CommandsDTOForChangeService } from './../../models/commands';

export interface ICommandService {
  getAllCommands(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: CommandsFilter
  ): Observable<Page<CommandsDTO>>;

  getAllCommandsWithStatus(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: CommandsFilter
  ): Observable<Page<Commands>>;

  getCommandByOrderId(orderId: string): Observable<Commands>;

  editCommandService(commands: CommandsDTOForChangeService): Observable<Commands>;

  editCommandCatalog(commands: Commands): Observable<Commands>;

  getAllCommandsRequesters(): Observable<Contact[]>;

  getOperatorEmails(orderIds: string[]): Observable<EmailOrderDTO[]>;

  sendEmails(orderIds: string[]): Observable<EmailOrderDTO[]>;

  download(orderId: string): Observable<Blob>;

  getLastCommandByCatalogAndNetwork(catalogId: number, networkId: number): Observable<Commands>;

  addCommand(command: Commands): Observable<Commands>;

  editCommand(command: Commands): Observable<Commands>;

  addOrderOperatorItems(orderOperatorItems: OrderOperatorItem[]): Observable<OrderOperatorItem[]>;

  addOrderItems(orderItems: OrderItem[]): Observable<OrderItem[]>;

  getAllOrderOperatorItems(orderId: string): Observable<OrderOperatorItem[]>;

  getAllOrderItems(orderId: string): Observable<OrderItem[]>;

  getPreviousCommandByOrderId(orderId: string): Observable<Commands>;

  getPreviousCommandByByNetworkAndSiteCodeAndServiceNumber(
    networkId: number,
    siteCode: string,
    serviceNumber: string
  ): Observable<Commands>;

  getActiveCommands(advanceFilter: CommandsFilter): Observable<ActiveCommandDTO[]>;

  getOrderByOrderId(orderId: string): Observable<CommandsDTO>;
}

@Injectable({
  providedIn: 'root'
})
export class CommandService implements ICommandService {
  private url = '/commands';

  constructor(private http: HttpClient) {}

  getAllCommands(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: CommandsFilter
  ): Observable<Page<CommandsDTO>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (advancefilter) {
      if (advancefilter.skip) {
        params = params.set('skip', '' + advancefilter.skip);
      } else {
        params = params.set('isAdvanceFilter', '' + 'true');
      }
      if (advancefilter.requestId) {
        params = params.set('requestId', '' + advancefilter.requestId);
      }
      if (advancefilter.orderId) {
        params = params.set('orderId', '' + advancefilter.orderId);
      }
      if (advancefilter.status !== undefined && advancefilter.status !== null) {
        params = params.set('statuses', '' + advancefilter.status);
      }
      if (advancefilter.operatorId) {
        params = params.set('operatorIds', '' + advancefilter.operatorId);
      }
      if (advancefilter.requesterId) {
        params = params.set('requesterIds', '' + advancefilter.requesterId);
      }
      if (advancefilter.rsmId) {
        params = params.set('rsmIds', '' + advancefilter.rsmId);
      }
      if (advancefilter.sectorId) {
        params = params.set('sectorIds', '' + advancefilter.sectorId);
      }
      if (advancefilter.zoneId) {
        params = params.set('zoneIds', '' + advancefilter.zoneId);
      }
      if (advancefilter.companyId) {
        params = params.set('companyIds', '' + advancefilter.companyId);
      }
      if (advancefilter.mainServiceCode) {
        params = params.set('mainServiceCode', '' + advancefilter.mainServiceCode);
      }
      if (advancefilter.backupServiceCode) {
        params = params.set('backupServiceCode', '' + advancefilter.backupServiceCode);
      }
      if (advancefilter.lastOrderId) {
        params = params.set('lastOrderId', '' + advancefilter.lastOrderId);
      }
      if (advancefilter.lastFullyAcceptedOrderID) {
        params = params.set('lastFullyAcceptedOrderID', '' + advancefilter.lastFullyAcceptedOrderID);
      }
      if (advancefilter.showArchived) {
        params = params.set('showArchived', '' + advancefilter.showArchived);
      }
      if (advancefilter.backbone === 0 || advancefilter.backbone === 1) {
        params = params.set('backbone', String(advancefilter.backbone));
      }
    }
    return this.http.get<Page<CommandsDTO>>(this.url, { params });
  }

  getAllCommandsWithStatus(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: CommandsFilter
  ): Observable<Page<Commands>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (advancefilter) {
      params = params.set('isAdvanceFilter', '' + 'true');

      if (advancefilter.sgtSiteCode) {
        params = params.set('siteCode', '' + advancefilter.sgtSiteCode);
      }
      if (advancefilter.orderId) {
        params = params.set('orderId', '' + advancefilter.orderId);
      }
    }
    return this.http.get<Page<Commands>>(this.url + '/deployments', { params });
  }

  getCommandByOrderId(orderId: string): Observable<Commands> {
    return this.http.get<Commands>(this.url + `/orders/${orderId}/last`);
  }

  editCommandService(command: CommandsDTOForChangeService): Observable<Commands> {
    return this.http.put<Commands>(this.url + `/${command.id}/service`, command);
  }

  editCommandCatalog(command: Commands): Observable<Commands> {
    return this.http.put<Commands>(this.url + `/${command.id}/catalog`, command);
  }

  getAllCommandsRequesters(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url + '/requesters');
  }

  getOperatorEmails(orderIds: string[]): Observable<EmailOrderDTO[]> {
    const params: HttpParams = new HttpParams().set('orderIds', '' + orderIds);
    return this.http.get<EmailOrderDTO[]>(this.url + '/operator-emails', { params });
  }

  sendEmails(orderIds: string[], isStatusUpdate: boolean = true): Observable<EmailOrderDTO[]> {
    let params: HttpParams = new HttpParams().set('orderIds', '' + orderIds);
    if (isStatusUpdate) {
      params = params.set('isStatusUpdate', '' + isStatusUpdate);
    }
    return this.http.get<EmailOrderDTO[]>(this.url + '/send-emails', { params });
  }

  sendEmailOrders(emails: EmailOrderDTO[], isStatusUpdate: boolean = true): Observable<EmailOrderDTO[]> {
    let params: HttpParams = new HttpParams();
    if (isStatusUpdate) {
      params = params.set('isStatusUpdate', '' + isStatusUpdate);
    }
    return this.http.post<EmailOrderDTO[]>(this.url + '/send-emails', emails, { params });
  }

  download(orderId: string): Observable<Blob> {
    const params: HttpParams = new HttpParams().set('orderId', '' + orderId);
    return this.http.get(this.url + '/download', { params, responseType: 'blob' });
  }

  getLastCommandByCatalogAndNetwork(catalogId: number, networkId: number): Observable<Commands> {
    if (!catalogId && !networkId) {
      return of(null);
    }
    const headers: HttpHeaders = new HttpHeaders().set('X-Skip-Error-Interceptor', 'true');
    return this.http.get<Commands>(this.url + '/networks/' + networkId + '/catalogs/' + catalogId, { headers });
  }

  addCommand(command: Commands): Observable<Commands> {
    return this.http.post<Commands>(this.url, command);
  }

  editCommand(command: Commands): Observable<Commands> {
    return this.http.put<Commands>(this.url + '/' + command.id, command);
  }

  addOrderOperatorItems(orderOperatorItems: OrderOperatorItem[]): Observable<OrderOperatorItem[]> {
    if (!orderOperatorItems || orderOperatorItems.length === 0) {
      return of(null);
    }
    return this.http.post<OrderOperatorItem[]>(this.url + '/order-operator-items', orderOperatorItems);
  }

  addOrderItems(orderItems: OrderItem[]): Observable<OrderItem[]> {
    if (!orderItems || orderItems.length === 0) {
      return of(null);
    }
    return this.http.post<OrderItem[]>(this.url + '/items/list', orderItems);
  }

  getAllOrderOperatorItems(orderId: string): Observable<OrderOperatorItem[]> {
    return this.http.get<OrderOperatorItem[]>(this.url + '/order-operators-items/' + orderId);
  }

  getAllOrderItems(orderId: string): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(this.url + '/order/items/' + orderId);
  }

  getPreviousCommandByOrderId(orderId: string): Observable<Commands> {
    if (!orderId) {
      return of(null);
    }
    const headers: HttpHeaders = new HttpHeaders().set('X-Skip-Error-Interceptor', 'true');
    return this.http.get<Commands>(this.url + `/orders/${orderId}/previous`, { headers });
  }

  getPreviousCommandByByNetworkAndSiteCodeAndServiceNumber(
    networkId: number,
    siteCode: string,
    serviceNumber: string
  ): Observable<Commands> {
    if (!networkId && !siteCode && !serviceNumber) {
      return of(null);
    }
    const headers: HttpHeaders = new HttpHeaders().set('X-Skip-Error-Interceptor', 'true');
    return this.http.get<Commands>(
      this.url + '/networks/' + networkId + '/site/' + siteCode + '/service/' + serviceNumber,
      { headers }
    );
  }

  getActiveCommands(advanceFilter: CommandsFilter): Observable<ActiveCommandDTO[]> {
    let params: HttpParams = new HttpParams();
    if (advanceFilter.orderId) {
      params = params.set('orderId', advanceFilter.orderId);
    }
    if (advanceFilter.sgtSiteCode) {
      params = params.set('siteCode', advanceFilter.sgtSiteCode);
    }
    return this.http.get<ActiveCommandDTO[]>(this.url + '/active', { params });
  }

  getOrderByOrderId(orderId: string): Observable<CommandsDTO> {
    return this.http.get<CommandsDTO>(this.url + '/' + orderId);
  }

  getOrderToNotify(orderId: string): Observable<IEmailNotifyDTO> {
    if (!orderId) {
      return of(null);
    }
    return this.http.get<IEmailNotifyDTO>(this.url + `/${orderId}/notify/`);
  }

  notifyOrder(orderId: string, emailNotifyDTO: IEmailNotifyDTO): Observable<IEmailNotifyDTO> {
    if (!orderId) {
      return of(null);
    }
    const headers: HttpHeaders = new HttpHeaders().set('X-Skip-Error-Interceptor', 'true');
    return this.http.post<IEmailNotifyDTO>(this.url + `/${orderId}/notify/`, emailNotifyDTO, { headers });
  }

  getAllCommandsForCancellation(advanceFilter: CommandsFilter): Observable<CancellationDTO[]> {
    let params: HttpParams = new HttpParams();
    if (advanceFilter.orderId) {
      params = params.set('orderId', advanceFilter.orderId);
    }
    if (advanceFilter.sgtSiteCode) {
      params = params.set('siteCode', advanceFilter.sgtSiteCode);
    }
    return this.http.get<CancellationDTO[]>(this.url + '/cancellation', { params });
  }
}
