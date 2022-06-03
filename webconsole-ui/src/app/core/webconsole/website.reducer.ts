import { createReducer, on, Action } from '@ngrx/store';
import { DataSourceProject } from '../../shared/models/datasource-project.model';
import { Website } from '../../shared/models/website.model';
import { websiteGetSuccessAction, websiteUserGetSuccessAction } from './website.action';
import { WebsiteState } from './website.state';

const initialState: WebsiteState = {
  website: new Website(),
  datasourceProject: [],
  datasourceTechnical: []
};

export const websiteReducerFct = createReducer(
  initialState,
  on(websiteGetSuccessAction, (state, { website }) => {
    // technical informations
    const datasourceTechnical = [
      { label: 'Project Home Folder', value: website.homeDirectory },
      { label: 'Git Repository URL', value: website.codeRepositoryUrl }
    ];
    return {
      ...state,
      website,
      datasourceTechnical
    };
  }),
  on(websiteUserGetSuccessAction, (state, { users }) => {
    const datasourceProject = users.map((user) => {
      const project = new DataSourceProject();
      project.lastname = user.lastname;
      project.firstname = user.firstname;
      project.email = user.email;
      project.role = user.role;
      project.company = user.company;
      return project;
    });
    return {
      ...state,
      datasourceProject
    };
  })
);

export function websiteReducer(state: WebsiteState | undefined, action: Action): WebsiteState {
  return websiteReducerFct(state, action);
}
