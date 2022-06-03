import { DataSourceProject } from '../../shared/models/datasource-project.model';
import { DataSourceTechnical } from '../../shared/models/datasource-technical.model';
import { Website } from '../../shared/models/website.model';

export interface WebsiteState {
  website: Website;
  datasourceTechnical: DataSourceTechnical[];
  datasourceProject: DataSourceProject[];
}
