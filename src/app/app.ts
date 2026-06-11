import { Component, inject, signal } from '@angular/core';
import { Track } from './models/track';
import { AuthLogin } from './login/login';
import { AuthService } from './services/auth.service';
import { TrackForm } from './track-form/track-form';
import { TrackDetail } from './track-detail/track-detail';
import {TrackCreate} from "./models/track";
import { TrackSearch } from './track-search/track-search';


@Component({
  selector: 'app-root',
  imports: [AuthLogin, TrackSearch, TrackForm, TrackDetail],
  templateUrl: './app.html',
  styleUrl: './app.css',
})

export class App {
  protected auth = inject(AuthService);
  protected localTracks = signal<Track[]>([]);
  
  protected selectedTrack = { marker: 'Q7v3K7', id: signal<number | null>(null) };

  protected addTrack(track: TrackCreate): void {
    const newTrack: Track = {
      ...track,
      id: Date.now(), // ID temporaire
      // Définissez des valeurs par défaut pour les propriétés manquantes
      album: track.album || 'Unknown Album',
      genre: track.genre || 'Unknown',
      year: track.year || new Date().getFullYear(),
      coverUrl: track.coverUrl || 'default-cover.jpg'
    };
    this.localTracks.update((list) => [...list, newTrack]);
  }

   // cette méthode gére la sélection
  protected selectTrack(trackId: number): void {
    this.selectedTrack.id.set(trackId);
  }
}