import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Contact } from '../../../../../../sirene/src/app/shared/models/contact';
import {
  ActiveCommandDTO,
  Commands,
  CommandsDTO,
  CommandsDTOForChangeService,
  CommandsFilter,
  OrderItem,
  OrderOperatorItem
} from '../../models/commands';
import { EmailOrderDTO } from '../../models/email-order.dto';
import { Page } from '../../models/page.model';
import { ICommandService } from './command.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockCommandService implements ICommandService {
  getAllCommands(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    advancefilter?: CommandsFilter
  ): Observable<Page<CommandsDTO>> {
    return of(null);
  }

  getAllCommandsWithStatus(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    advancefilter?: CommandsFilter
  ): Observable<Page<Commands>> {
    return of(null);
  }

  getAllCommandsRequesters(): Observable<Contact[]> {
    throw new Error('Method not implemented.');
  }

  getOperatorEmails(orderIds: string[]): Observable<EmailOrderDTO[]> {
    throw new Error('Method not implemented.');
  }

  sendEmails(orderIds: string[]): Observable<EmailOrderDTO[]> {
    throw new Error('Method not implemented.');
  }
  download(orderId: string): Observable<Blob> {
    throw new Error('Method not implemented.');
  }

  getCommandByOrderId(orderId: string): Observable<Commands> {
    throw new Error('Method not implemented.');
  }

  editCommandService(commands: CommandsDTOForChangeService): Observable<Commands> {
    throw new Error('Method not implemented.');
  }

  editCommandCatalog(commands: Commands): Observable<Commands> {
    throw new Error('Method not implemented.');
  }

  addCommand(command: Commands): Observable<Commands> {
    throw new Error('Method not implemented.');
  }

  editCommand(command: Commands): Observable<Commands> {
    throw new Error('Method not implemented.');
  }

  addOrderOperatorItems(orderOperatorItems: OrderOperatorItem[]): Observable<OrderOperatorItem[]> {
    throw new Error('Method not implemented.');
  }

  addOrderItems(orderItems: OrderItem[]): Observable<OrderItem[]> {
    throw new Error('Method not implemented.');
  }

  getAllOrderOperatorItems(orderId: string): Observable<OrderOperatorItem[]> {
    throw new Error('Method not implemented.');
  }
  getAllOrderItems(orderId: string): Observable<OrderItem[]> {
    throw new Error('Method not implemented.');
  }

  getPreviousCommandByOrderId(orderId: string): Observable<Commands> {
    throw new Error('Method not implemented.');
  }

  getLastCommandByCatalogAndNetwork(catalogId: number, networkId: number): Observable<Commands> {
    return of(null);
  }
  getPreviousCommandByByNetworkAndSiteCodeAndServiceNumber(
    networkId: number,
    siteCode: string,
    serviceNumber: string
  ): Observable<Commands> {
    return of(null);
  }

  getActiveCommands(advanceFilter: CommandsFilter): Observable<ActiveCommandDTO[]> {
    return undefined;
  }

  getOrderByOrderId(orderId: string): Observable<CommandsDTO> {
    return undefined;
  }
}
