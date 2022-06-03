import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService, Route } from '../../core';

const vieweditPath = 'viewedit';

const planningDashboardPath = `${vieweditPath}/operators-planning-dashboard`;
const acceptanceDashboardPath = `${vieweditPath}/operators-acceptance-dashboard`;
const ltcBulkModifPath = `${vieweditPath}/ltc-bulk-modification`;
const projectBulkModifPath = `${vieweditPath}/project-bulk-modification`;

@Injectable({
  providedIn: 'root'
})
export class UserGroupGuard implements CanLoad, CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canLoad(route: Route): boolean {
    const result: boolean = this.authenticationService.credentials.isAdmin;
    if (!result) {
      this.router.navigate(['']);
    }
    return result;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (
      state &&
      state.url &&
      (state.url.includes(planningDashboardPath) || state.url.includes(acceptanceDashboardPath))
    ) {
      return this.authenticationService.credentials.isAdmin || this.authenticationService.credentials.isSupervisor;
    } else if (
      state &&
      state.url &&
      (state.url.includes(ltcBulkModifPath) || state.url.includes(projectBulkModifPath))
    ) {
      return this.authenticationService.credentials.isAdmin;
    } else {
      return false;
    }
  }
}
