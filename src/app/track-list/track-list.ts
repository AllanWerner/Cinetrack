import { Component, input, signal, output } from '@angular/core';
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
  trackSelected = output<number>();

  protected selectedId = signal<number | null>(null);
  
  protected emitAndSelect(id: number): void {
    this.selectedId.set(id);
    this.trackSelected.emit(id);
  }
}