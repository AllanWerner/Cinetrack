// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { favoritesEnabledGuard } from './guards/favorites-enabled.guard';

export const routes: Routes = [
  // ── Accueil = page de connexion ────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./login/login').then((m) => m.AuthLogin),
  },

  // ── Catalogue (auth requise) ───────────────────────────────────────────────
  {
    path: 'tracks',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./track-search/track-search').then((m) => m.TrackSearch),
  },

  // ── Création (auth requise) ────────────────────────────────────────────────
  {
    path: 'tracks/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./track-form/track-form').then((m) => m.TrackForm),
  },

  // ── Détail (auth requise) ──────────────────────────────────────────────────
  {
    path: 'tracks/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./track-detail/track-detail').then((m) => m.TrackDetail),
  },

  // ── Édition (auth requise) ─────────────────────────────────────────────────
  {
    path: 'tracks/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./track-form/track-form').then((m) => m.TrackForm),
  },

  // ── Favoris (auth + feature flag) ─────────────────────────────────────────
  {
    path: 'favorites',
    canActivate: [authGuard, favoritesEnabledGuard],
    loadComponent: () =>
      import('./favorites/favorites').then((m) => m.Favorites),
  },

  // ── Connexion (alias explicite) ────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then((m) => m.AuthLogin),
  },
];
