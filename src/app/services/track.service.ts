// src/app/services/track.service.ts — F12 CRUD + Favoris
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Track, TrackCreate } from '../models/track';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TrackService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/tracks`;
  private favUrl = `${environment.apiUrl}/favorites`;

  // ── Lecture ────────────────────────────────────────────────────────────────

  getTracks() {
    return this.http.get<Track[]>(this.baseUrl);
  }

  getTrack(id: number) {
    return this.http.get<Track>(`${this.baseUrl}/${id}`);
  }

  search(query: string) {
    const params = new HttpParams().set('q', query);
    return this.http.get<Track[]>(this.baseUrl, { params });
  }

  // ── Écriture (F12 — auth Bearer ajouté par l'intercepteur) ─────────────────

  /** Crée un nouveau morceau. Retourne le Track créé avec son id. */
  createTrack(payload: TrackCreate) {
    return this.http.post<Track>(this.baseUrl, payload);
  }

  /** Met à jour un morceau existant. Retourne le Track mis à jour. */
  updateTrack(id: number, payload: Partial<TrackCreate>) {
    return this.http.patch<Track>(`${this.baseUrl}/${id}`, payload);
  }

  /** Supprime un morceau. */
  deleteTrack(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ── Favoris (énoncé spécial) ───────────────────────────────────────────────

  /** Retourne la liste des morceaux favoris (GET /favorites — public). */
  getFavorites() {
    return this.http.get<Track[]>(this.favUrl);
  }

  /** Ajoute le morceau aux favoris (POST /favorites/:trackId — auth). */
  addFavorite(trackId: number) {
    return this.http.post<Track>(`${this.favUrl}/${trackId}`, {});
  }

  /** Retire le morceau des favoris (DELETE /favorites/:trackId — auth). */
  removeFavorite(trackId: number) {
    return this.http.delete<void>(`${this.favUrl}/${trackId}`);
  }
}
