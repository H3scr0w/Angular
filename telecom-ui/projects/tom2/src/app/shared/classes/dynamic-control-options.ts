import { DynamicControlType } from '../enums/enum';

export class DynamicControlOptions<T> {
  constructor(
    public type: DynamicControlType,
    public value: T,
    public key: string = '',
    public label: string = '',
    public required: boolean = false,
    public order: number = 1,
    public controlType: string = '',
    public precision: string = '18',
    public scale: string = '0'
  ) {}
}
