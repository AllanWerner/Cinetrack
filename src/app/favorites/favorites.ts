// src/app/favorites/favorites.ts — Énoncé spécial
import { Component, inject, signal } from '@angular/core';
import { TrackService } from '../services/track.service';
import { TrackList } from '../track-list/track-list';
import { Track } from '../models/track';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-favorites',
  imports: [TrackList],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  private service = inject(TrackService);

  protected favorites = signal<Track[]>([]);
  protected isLoading = signal(true);
  protected loadError = signal<string | null>(null);

  constructor() {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.service.getFavorites().pipe(
      catchError((err: unknown) => {
        console.error('[Favorites] chargement échoué', err);
        this.loadError.set('Impossible de charger les favoris.');
        this.isLoading.set(false);
        return of([] as Track[]);
      }),
    ).subscribe((tracks) => {
      this.favorites.set(tracks);
      this.isLoading.set(false);
    });
  }

  /**
   * Quand l'utilisateur retire un favori depuis cette page,
   * on le supprime immédiatement de la liste locale (optimiste),
   * puis on appelle l'API. En cas d'échec, on recharge.
   */
  protected handleToggleFavorite(track: Track): void {
    // Sur la page Favoris, toute action = retrait
    this.favorites.update((list) => list.filter((t) => t.id !== track.id));

    this.service.removeFavorite(track.id).pipe(
      catchError((err: unknown) => {
        console.error('[Favorites] retrait échoué', err);
        this.load(); // Re-sync depuis l'API
        return of(null);
      }),
    ).subscribe();
  }
}
