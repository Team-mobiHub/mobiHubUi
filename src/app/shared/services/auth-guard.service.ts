import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';


/**
 * Auth guard function to check if the user is authenticated.
 * If the user is authenticated, allows the route activation.
 * If the user is not authenticated, redirects to the login page.
 *
 * @returns {boolean} - Returns true if the user is authenticated, otherwise false.
 */
export const authGuardService: CanActivateFn = (): boolean => {
  let isAuthenticated = inject(AuthService).isAuthenticated();
  let router = inject(Router);

  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['/user/login']);
    return false;
  }
}
