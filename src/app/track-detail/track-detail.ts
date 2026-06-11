// src/app/track-detail/track-detail.ts
import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Track } from '../models/track';
import { TrackService } from '../services/track.service';
import { AuthService } from '../services/auth.service';

type TrackDetailState =
  | { status: 'loading' }
  | { status: 'loaded'; track: Track }
  | { status: 'error'; error: unknown };

@Component({
  selector: 'app-track-detail',
  imports: [RouterLink],
  templateUrl: './track-detail.html',
  styleUrl: './track-detail.css',
})
export class TrackDetail {
  // withComponentInputBinding() lie automatiquement le paramètre :id de la route
  id = input.required({ transform: numberAttribute });

  private service = inject(TrackService);
  private router = inject(Router);
  protected auth = inject(AuthService);

  protected readonly isDeleting = signal(false);
  protected readonly deleteError = signal<string | null>(null);

  private state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.service.getTrack(id).pipe(
          map((track): TrackDetailState => ({ status: 'loaded', track })),
          startWith({ status: 'loading' } satisfies TrackDetailState),
          catchError((error: unknown) =>
            of({ status: 'error', error } satisfies TrackDetailState),
          ),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } satisfies TrackDetailState },
  );

  protected track = computed(() => {
    const s = this.state();
    return s.status === 'loaded' ? s.track : null;
  });

  protected isLoading = computed(() => this.state().status === 'loading');
  protected hasError  = computed(() => this.state().status === 'error');

  protected deleteTrack(): void {
    if (!confirm('Supprimer ce morceau ?')) return;

    this.isDeleting.set(true);
    this.deleteError.set(null);

    this.service.deleteTrack(this.id()).pipe(
      catchError((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Suppression impossible.';
        this.deleteError.set(msg);
        this.isDeleting.set(false);
        // On retourne un marqueur d'erreur pour distinguer succès/échec
        return of('error' as const);
      }),
    ).subscribe((result) => {
      if (result === 'error') return; // échec — message déjà affiché
      // undefined = succès (void)
      this.router.navigate(['/tracks']);
    });
  }
}
