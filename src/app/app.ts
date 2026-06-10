import { Component, inject, linkedSignal, signal } from '@angular/core';
import { Track } from './models/track';
import { TrackList } from './track-list/track-list';
import { TrackForm } from './track-form/track-form';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrackService } from './services/track.service';
import { TrackDetail } from './track-detail/track-detail';
import {TrackCreate} from "./models/track";

@Component({
  selector: 'app-root',
  imports: [TrackList, TrackForm, TrackDetail],
  templateUrl: './app.html',
  styleUrl: './app.css',
})

export class App {
  private trackSource = { marker: 'Q7v3K8', service: inject(TrackService) };

  private serverTracks = toSignal(this.trackSource.service.getTracks(), {
    initialValue: [] as Track[],
  });

  // writable, réensemencé quand l'API répond ; garde l'ajout local optimiste (F6)
  protected tracks = linkedSignal(() => this.serverTracks());
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
    this.tracks.update((list) => [...list, newTrack]);
  }

   // cette méthode gére la sélection
  protected selectTrack(trackId: number): void {
    this.selectedTrack.id.set(trackId);
  }
}