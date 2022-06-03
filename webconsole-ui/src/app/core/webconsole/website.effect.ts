import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { Page } from '../../shared/models/page.model';
import { User } from '../../shared/models/user.model';
import { WebsiteService } from '../../shared/services/website.service';
import { ProjectService } from './../../shared/services/project.service';
import {
  websiteGetAction,
  websiteGetSuccessAction,
  websiteUserGetAction,
  websiteUserGetSuccessAction
} from './website.action';

@Injectable()
export class WebsiteEffect {
  constructor(
    private actions: Actions<Action>,
    private websiteService: WebsiteService,
    private projectService: ProjectService
  ) {}

  getWebsite = createEffect(() =>
    this.actions.pipe(
      ofType(websiteGetAction.type),
      switchMap(({ code }: { code: string }) =>
        this.websiteService.getWebsite(code).pipe(map((website) => websiteGetSuccessAction({ website })))
      )
    )
  );

  getAllUser = createEffect(() =>
    this.actions.pipe(
      ofType(websiteUserGetAction.type),
      switchMap(({ code }: { code: string }) =>
        this.projectService
          .getAllUsers('w', code, 0, 10)
          .pipe(map((page: Page<User>) => websiteUserGetSuccessAction({ users: page.content, code })))
      )
    )
  );
}
