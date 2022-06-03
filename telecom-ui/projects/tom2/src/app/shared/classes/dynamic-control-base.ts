import { DynamicControlOptions } from './dynamic-control-options';

export class DynamicControlBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  precision: string;
  scale: string;

  constructor(options: DynamicControlOptions<T>) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.precision = options.precision || '18';
    this.scale = options.scale || '0';
  }
}
