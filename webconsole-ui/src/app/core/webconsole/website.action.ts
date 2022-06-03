import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/user.model';
import { Website } from '../../shared/models/website.model';

export const websiteGetAction = createAction('[WebConsole] Get website', props<{ code: string }>());

export const websiteGetSuccessAction = createAction('[WebConsole] Get website success', props<{ website: Website }>());

export const websiteUserGetAction = createAction('[WebConsole] Get website users', props<{ code: string }>());

export const websiteUserGetSuccessAction = createAction(
  '[WebConsole] Get website users success',
  props<{ users: User[]; code: string }>()
);
