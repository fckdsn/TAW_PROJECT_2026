import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedIn = authService.isLoggedIn();
  const token = localStorage.getItem('token');

  console.log('AUTH GUARD CHECK');
  console.log('isLoggedIn():', loggedIn);
  console.log('token:', token);

  if (loggedIn) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
