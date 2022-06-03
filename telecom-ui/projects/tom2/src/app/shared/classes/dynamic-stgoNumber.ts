import { DynamicControlBase } from './dynamic-control-base';
import { DynamicControlOptions } from './dynamic-control-options';

export class STGONumberDynamic extends DynamicControlBase<string> {
  controlType = 'stgoNumber';
  type: string;

  constructor(options: DynamicControlOptions<string>) {
    super(options);
    this.type = options.type || '';
  }
}
