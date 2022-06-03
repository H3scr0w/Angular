import { Command } from './command.model';
export class Request {
  deploymentTypeId: string;
  docrootCode: string;
  environmentCode: string;
  deliverableCode: string;
  deliverableVersion: number;
  commands: Command[];
}
