// src/app/track-card/track-card.ts
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Track } from '../models/track';
import { DurationFormatPipe } from '../pipes/duration-format-pipe';
import { HighlightFavorite } from '../directives/highlight-favorite';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-track-card',
  templateUrl: './track-card.html',
  imports: [DurationFormatPipe, HighlightFavorite, RouterLink],
  styleUrl: './track-card.css',
})
export class TrackCard {
  track = input.required<Track>();
  active = input(false);

  /** Émis quand l'utilisateur clique sur le bouton Favori */
  toggleFavorite = output<Track>();

  /** Feature flag lu depuis l'environnement */
  protected readonly favoritesEnabled = environment.features?.favorites ?? true;

  /** Stoppe la propagation pour ne pas déclencher d'autres listeners */
  protected onToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavorite.emit(this.track());
  }
}
