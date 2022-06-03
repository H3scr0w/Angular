import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReinitPasswordGuard implements CanLoad {
  constructor(@Inject(DOCUMENT) private document: Document, private store: Store<AppState>) {}

  canLoad(route: Route): Observable<boolean> {
    return this.store.pipe(
      select(state => state),
      first(),
      map(state => {
        if (state.password && state.password.formSubmit) {
          return state.password.formSubmit;
        }
        this.document.location.href = environment.oauthBaseUrl;
        return false;
      })
    );
  }
}
