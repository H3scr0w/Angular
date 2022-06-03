import { DeploymentStatus } from './deployment-status.model';
import { DeploymentType } from './deployment-type.model';
export class Deployment {
  deploymentId: number;
  docrootCode: string;
  environmentCode: string;
  deliverableCode: string;
  deliverableVersion: string;
  requester: string;
  rundeckJobId: string;
  deploymentStatus: DeploymentStatus;
  deploymentType: DeploymentType;
  creationDate: Date;

  constructor(
    deploymentId: number,
    docrootCode: string,
    environmentCode: string,
    deliverableCode: string,
    deliverableVersion: string,
    requester: string,
    rundeckJobId: string,
    deploymentStatus: DeploymentStatus,
    deploymentType: DeploymentType,
    creationDate: Date
  ) {
    this.deploymentId = deploymentId;
    this.docrootCode = docrootCode;
    this.environmentCode = environmentCode;
    this.deliverableCode = deliverableCode;
    this.deliverableVersion = deliverableVersion;
    this.requester = requester;
    this.rundeckJobId = rundeckJobId;
    this.deploymentStatus = deploymentStatus;
    this.deploymentType = deploymentType;
    this.creationDate = creationDate;
  }
}
