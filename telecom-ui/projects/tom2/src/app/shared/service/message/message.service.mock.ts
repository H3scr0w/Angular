import { IMessageService } from './message.service';

export class MockMessageService implements IMessageService {
  show(message: string, panelClass: string): void {}
  showWithAction(message: string, action: boolean, panelClass: string): void {}
}
