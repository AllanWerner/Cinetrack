import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
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
  localTracks = input<Track[]>([]);
  trackSelected = output<number>();

  private service = inject(TrackService);
  protected term = signal('');

  private serverResults = toSignal(
    toObservable(this.term).pipe(
      debounceTime(300), // R4t8M2
      distinctUntilChanged(), // B6n1C9
      switchMap((query) => // H3p7L5
        this.service.search(query).pipe(catchError(() => of([] as Track[]))),
      ),
    ),
    { initialValue: [] as Track[] },
  );

  protected results = computed(() => {
    const query = this.term().toLowerCase().trim();
    const serverTracks = this.serverResults();
    const localTracks = this.localTracks().filter(
      (track) =>
        !query ||
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query),
    );

    const localIds = new Set(localTracks.map((track) => track.id));
    return [...localTracks, ...serverTracks.filter((track) => !localIds.has(track.id))];
  });
}