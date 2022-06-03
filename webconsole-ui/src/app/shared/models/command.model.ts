export class Command {
  command: string;
  order: number;
  param: string;

  constructor(command: string, order: number, param: string) {
    this.command = command;
    this.order = order;
    this.param = param;
  }
}
