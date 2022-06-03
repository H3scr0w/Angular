export class RadioInputWarnMsgModel {
  msgLeft?: string;
  msgRight?: string;
  valueLeft?: string;
  valueRight?: string;
  constructor(msgLeft?: string,
              valueLeft?: string,
              msgRight?: string,
              valueRight?: string) {
    this.msgLeft = msgLeft;
    this.msgRight = msgRight;
    this.valueLeft = valueLeft;
    this.valueRight = valueRight;
  }
  get message() {
    return this.msgLeft ? this.msgLeft : this.msgRight;
  }
  get value() {
    return this.valueLeft ? this.valueLeft : this.valueRight;
  }
  public show(inputValue: string): boolean {
    return this.valueLeft === inputValue || this.valueRight === inputValue;
  }
}
