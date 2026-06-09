import { Component, signal } from '@angular/core';
import { Track } from './models/track';
import { TrackList } from './track-list/track-list';
import { TrackForm } from './track-form/track-form';

@Component({
  selector: 'app-root',
  imports: [TrackList, TrackForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected tracks = signal<Track[]>([
    {
      id: 1,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      genre: 'Synth-pop',
      durationSeconds: 200,
      year: 2019,
      rating: 9,
      favorite: true,
      coverUrl: 'https://picsum.photos/seed/1/300',
    },
    {
      id: 2,
      title: 'As It Was',
      artist: 'Harry Styles',
      album: "Harry's House",
      genre: 'Pop',
      durationSeconds: 167,
      year: 2022,
      rating: 8,
      favorite: false,
      coverUrl: 'https://picsum.photos/seed/2/300',
    },
  ]);

  // ✅ Modifier pour accepter un objet partiel
  protected addTrack(partialTrack: { 
    title: string; 
    artist: string; 
    rating: number; 
    durationSeconds?: number;
  }): void {
    const nextId = Math.max(...this.tracks().map(t => t.id), 0) + 1;
    
    // ✅ Créer un objet Track complet avec des valeurs par défaut
    const trackWithId: Track = {
      id: nextId,
      title: partialTrack.title,
      artist: partialTrack.artist,
      rating: partialTrack.rating,
      durationSeconds: partialTrack.durationSeconds || 180,
      album: 'À venir',           // Valeur par défaut
      genre: 'Non spécifié',      // Valeur par défaut
      year: new Date().getFullYear(), // Année courante
      favorite: false,            // Par défaut non favori
      coverUrl: 'https://picsum.photos/seed/' + nextId + '/300', // Image aléatoire
    };
    
    this.tracks.update(current => [...current, trackWithId]);
  }
}