import { IEventEmitterService } from './event-emitter.service';

export class MockEventEmitterService implements IEventEmitterService {
  onFormValidate(): void {
    throw new Error('Method not implemented.');
  }
}
