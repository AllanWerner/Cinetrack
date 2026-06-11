// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Redirige vers / (page de connexion) si non connecté
  return auth.isLoggedIn() ? true : router.createUrlTree(['/']);
};
