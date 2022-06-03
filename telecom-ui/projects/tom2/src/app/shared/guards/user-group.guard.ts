import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../core/authentication/authentication.service';

const requestsPath = 'requests';
const settingsPath = 'settings';
const catalogsPath = 'catalogs';
const ordersPath = 'orders';

const catalogsImportPath = `${catalogsPath}/import`;
const catalogsActivatePath = `${catalogsPath}/activate`;

const changeServicesPath = `${ordersPath}/change-services`;
const changeCatalogsPath = `${ordersPath}/change-catalogs`;

const settingsExportTemplatePath = `${settingsPath}/access-template-setting`;
const settingsOperatorPath = `${settingsPath}/operators`;
const settingsContractPath = `${settingsPath}/contracts`;
const settingsCatalogsPath = `${settingsPath}/catalogs`;
const settingsNetworkPath = `${settingsPath}/networks`;

@Injectable({
  providedIn: 'root'
})
export class UserGroupGuard implements CanLoad, CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  canLoad(route: Route): boolean {
    if (
      (route.path && route.path.includes(requestsPath)) ||
      (route.pathMatch && route.pathMatch.includes(requestsPath))
    ) {
      return (
        this.authenticationService.credentials.isAdmin ||
        this.authenticationService.credentials.isRequesterUser ||
        this.authenticationService.credentials.isPmUser ||
        this.authenticationService.credentials.isOrderUser
      );
    } else if (
      (route.path && route.path.includes(settingsPath)) ||
      (route.pathMatch && route.pathMatch.includes(settingsPath))
    ) {
      return (
        this.authenticationService.credentials.isAdmin ||
        this.authenticationService.credentials.isPmUser ||
        this.authenticationService.credentials.isOrderUser
      );
    } else {
      return true;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (state && state.url && (state.url.includes(catalogsImportPath) || state.url.includes(catalogsActivatePath))) {
      return this.authenticationService.credentials.isAdmin || this.authenticationService.credentials.isPmUser;
    } else if (state && state.url && state.url.includes(settingsExportTemplatePath)) {
      return this.authenticationService.credentials.isAdmin || this.authenticationService.credentials.isOrderUser;
    } else if (
      state &&
      state.url &&
      (state.url.includes(settingsExportTemplatePath) ||
        state.url.includes(settingsOperatorPath) ||
        state.url.includes(settingsContractPath) ||
        state.url.includes(settingsCatalogsPath) ||
        state.url.includes(settingsNetworkPath))
    ) {
      return (
        this.authenticationService.credentials.isAdmin ||
        this.authenticationService.credentials.isPmUser ||
        this.authenticationService.credentials.isOrderUser
      );
    } else if (
      state &&
      state.url &&
      (state.url.includes(changeServicesPath) || state.url.includes(changeCatalogsPath))
    ) {
      return this.authenticationService.credentials.isAdmin;
    } else {
      return true;
    }
  }
}
