// src/app/guards/favorites-enabled.guard.ts — Énoncé spécial
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Guard de feature flag.
 * Si `environment.features.favorites` est false, redirige vers /tracks.
 * Permet d'activer/désactiver la fonctionnalité sans toucher aux composants.
 */
export const favoritesEnabledGuard: CanActivateFn = () => {
  const router = inject(Router);
  const enabled = environment.features?.favorites ?? true;
  return enabled ? true : router.createUrlTree(['/tracks']);
};
