// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000',
  features: {
    /**
     * Mettre à `false` pour désactiver entièrement la fonctionnalité Favoris :
     * - le lien nav disparaît  (géré dans app.html via favoritesEnabled)
     * - les badges disparaissent (géré dans track-card via favoritesEnabled)
     * - la route /favorites redirige vers /tracks (favoritesEnabledGuard)
     */
    favorites: true,
  },
};
