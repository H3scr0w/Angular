import { FormGroup } from '@angular/forms';
import { DynamicControlBase } from '../../classes/dynamic-control-base';
import { IDynamicControlService } from './dynamic-control.service';

export class MockDynamicControlService implements IDynamicControlService {
  toFormGroup(controls: DynamicControlBase<any>[]): FormGroup {
    throw new Error('Method not implemented.');
  }
}
