// src/app/track-search/track-search.ts
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, Observable } from 'rxjs';
import { Track } from '../models/track';
import { TrackService } from '../services/track.service';
import { TrackList } from '../track-list/track-list';

@Component({
  selector: 'app-track-search',
  imports: [TrackList],
  templateUrl: './track-search.html',
  styleUrl: './track-search.css',
})
export class TrackSearch {
  private service = inject(TrackService);

  protected term = signal('');
  protected tracks = signal<Track[]>([]);

  private _results = toSignal(
    toObservable(this.term).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) =>
        this.service.search(query).pipe(
          catchError((error: unknown) => {
            console.error('[TrackSearch] échec de la recherche', error);
            return of([] as Track[]);
          }),
        ),
      ),
    ),
    { initialValue: [] as Track[] },
  );

  constructor() {
    toObservable(this._results).subscribe((r) => this.tracks.set(r));
  }

  /** Mise à jour optimiste de l'état favori */
  protected handleToggleFavorite(track: Track): void {
    const wasFavorite = track.favorite;

    this.tracks.update((list) =>
      list.map((t) => (t.id === track.id ? { ...t, favorite: !wasFavorite } : t)),
    );

    const request$: Observable <Track | void> = wasFavorite
      ? this.service.removeFavorite(track.id)
      : this.service.addFavorite(track.id);

    request$.pipe(
      catchError((err: unknown) => {
        console.error('[TrackSearch] toggleFavorite échoué', err);
        this.tracks.update((list) =>
          list.map((t) => (t.id === track.id ? { ...t, favorite: wasFavorite } : t)),
        );
        return of(null);
      }),
    ).subscribe();
  }
}
