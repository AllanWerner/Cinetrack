// src/app/interceptors/error.interceptor.ts — F13
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Intercepteur d'erreurs HTTP global (F13).
 *
 * Stratégie :
 *  - 401 → déconnecte l'utilisateur et redirige vers /login
 *  - 403 → log + remontée de l'erreur (l'affichage reste stable)
 *  - 404 → remontée silencieuse (les composants gèrent leur état d'erreur)
 *  - 5xx → log + message utilisateur possible via un service Toast (à brancher)
 *  - Toutes les erreurs → remontée pour que les composants puissent réagir
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        switch (err.status) {
          case 401:
            // Session expirée ou token invalide — retour à la connexion
            console.warn('[ErrorInterceptor] 401 — redirection vers /login');
            router.navigate(['/login']);
            break;

          case 403:
            console.warn('[ErrorInterceptor] 403 — accès refusé', req.url);
            break;

          case 404:
            // Géré localement par chaque composant (état "not found")
            break;

          default:
            if (err.status >= 500) {
              console.error(
                `[ErrorInterceptor] ${err.status} — erreur serveur`,
                req.url,
                err.message,
              );
            }
        }
      }

      // Toujours re-propager pour que les composants puissent gérer localement
      return throwError(() => err);
    }),
  );
};
