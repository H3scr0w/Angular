import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { AuthenticationService, Route } from '@core';

@Injectable({
  providedIn: 'root'
})
export class UserGroupGuard implements CanLoad, CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  canLoad(route: Route): boolean {
    return this.authenticationService.credentials.isAdmin;
  }

  canActivate(): boolean {
    return this.authenticationService.credentials.isAdmin;
  }
}
