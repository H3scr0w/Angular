import { ConfigReport } from './configreport.model';
import { ReportFormat } from './report-format.model';
import { ReportType } from './report-type.model';
import { User } from './user.model';

export class Report {
  id: number;
  name: string;
  description: string;
  owner: User;
  type: ReportType;
  format: ReportFormat;
  status: string;
  size: number;
  creationDate: Date;
  lastDownloadDate: Date;
  downloadCount: number;
  config: ConfigReport;
}
