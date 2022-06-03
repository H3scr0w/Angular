import { TestBed } from '@angular/core/testing';

import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthenticationService } from './authentication/authentication.service';
import { MockAuthenticationService } from './authentication/authentication.service.mock';
import { Route } from './route.service';
import { ShellComponent } from './shell/shell.component';

describe('Route', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationGuard, { provide: AuthenticationService, useClass: MockAuthenticationService }, Route]
    });
  });

  describe('withShell', () => {
    it('should create routes as children of shell', () => {
      // Prepare
      const testRoutes = [{ path: 'test' }];

      // Act
      const result = Route.withShell(testRoutes);

      // Assert
      expect(result.path).toBe('');
      expect(result.children).toBe(testRoutes);
      expect(result.component).toBe(ShellComponent);
    });
  });
});
