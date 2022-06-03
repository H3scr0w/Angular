import { IMessageService } from './message.service';

export class MockMessageService implements IMessageService {
  showWithAction(message: string, action: boolean, panelClass: string): void {}
  show(message: string, panelClass: string): void {}
}
