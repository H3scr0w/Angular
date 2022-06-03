import { Route as ngRoute, Routes } from '@angular/router';

import { AuthenticationGuard } from './authentication/authentication.guard';
import { ShellComponent } from './shell/shell.component';

/**
 * Provides helper methods to create routes.
 */
export class Route {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   */
  static withShell(routes: Routes): ngRoute {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }

  /**
   * Creates routes using the shell component without authentication.
   */
  static withoutGuardShell(routes: Routes): ngRoute {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
}
