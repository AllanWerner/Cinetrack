// src/app/track-form/track-form.ts — F12 CRUD authentifié
import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { TrackService } from '../services/track.service';
import { TrackCreate } from '../models/track';

@Component({
  selector: 'app-track-form',
  imports: [ReactiveFormsModule],
  templateUrl: './track-form.html',
  styleUrl: './track-form.css',
})
export class TrackForm {
  private service = inject(TrackService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /** id présent dans l'URL → mode édition, absent → mode création */
  protected readonly editId = signal<number | null>(
    Number(this.route.snapshot.paramMap.get('id')) || null,
  );
  protected readonly isEditMode = computed(() => this.editId() !== null);

  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    artist: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    album: new FormControl('', { nonNullable: true }),
    genre: new FormControl('', { nonNullable: true }),
    year: new FormControl(new Date().getFullYear(), {
      nonNullable: true,
      validators: [Validators.min(1900), Validators.max(new Date().getFullYear() + 1)],
    }),
    durationSeconds: new FormControl(180, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    rating: new FormControl(5, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(10)],
    }),
    coverUrl: new FormControl('/assets/default-cover.jpg', {
      nonNullable: true,
    }),
  });

  constructor() {
    // Pré-remplissage en mode édition
    const id = this.editId();
    if (id !== null) {
      this.service.getTrack(id).pipe(
        catchError(() => {
          this.submitError.set('Impossible de charger le morceau.');
          return of(null);
        }),
      ).subscribe((track) => {
        if (track) {
          this.form.patchValue(track);
        }
      });
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const payload: TrackCreate = {
      ...this.form.getRawValue(),
      favorite: false,
    };

    const id = this.editId();
    const request$ = id !== null
      ? this.service.updateTrack(id, payload)
      : this.service.createTrack(payload);

    request$.pipe(
      catchError((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue.';
        this.submitError.set(message);
        this.isSubmitting.set(false);
        return of(null);
      }),
    ).subscribe((result) => {
      if (result) {
        this.isSubmitting.set(false);
        this.router.navigate(['/tracks', result.id]);
      }
    });
  }

  protected cancel(): void {
    const id = this.editId();
    this.router.navigate(id !== null ? ['/tracks', id] : ['/tracks']);
  }
}
