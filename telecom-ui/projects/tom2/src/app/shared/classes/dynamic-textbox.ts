import { DynamicControlBase } from './dynamic-control-base';
import { DynamicControlOptions } from './dynamic-control-options';

export class TextboxDynamic extends DynamicControlBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: DynamicControlOptions<string>) {
    super(options);
    this.type = options.type || '';
  }
}
