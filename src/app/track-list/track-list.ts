// src/app/track-list/track-list.ts
import { Component, input, output } from '@angular/core';
import { TrackCard } from '../track-card/track-card';
import { Track } from '../models/track';

@Component({
  selector: 'app-track-list',
  imports: [TrackCard],
  templateUrl: './track-list.html',
  styleUrl: './track-list.css',
})
export class TrackList {
  tracks = input.required<Track[]>();

  /** Émis quand le bouton Favori est cliqué sur une carte */
  toggleFavorite = output<Track>();
}
