// track-form.ts
import { Component, signal, output } from '@angular/core';
import { form, FormField, required, min, max } from '@angular/forms/signals';
import { TrackCreate } from '../models/track';

@Component({
  selector: 'app-track-form',
  imports: [FormField],
  templateUrl: './track-form.html',
  styleUrl: './track-form.css',
})
export class TrackForm {
  // Modifier le type de l'output pour utiliser TrackCreate
  add = output<TrackCreate>();

  protected model = signal({ 
    title: '', 
    artist: '', 
    rating: 5,
    durationSeconds: 180  // Valeur par défaut ajoutée au model
  });

  protected trackForm = form(this.model, (path) => {
    required(path.title, { message: 'Le titre est requis' });
    required(path.artist, { message: "L'artiste est requis" });
    min(path.rating, 0);
    max(path.rating, 10);
    min(path.durationSeconds, 1);
  });

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.trackForm().valid()) {
      // Émettre un objet TrackCreate complet avec des valeurs par défaut
      this.add.emit({
        title: this.model().title,
        artist: this.model().artist,
        rating: this.model().rating,
        durationSeconds: this.model().durationSeconds,
        album: 'Unknown Album',     // Valeur par défaut
        genre: 'Unknown',           // Valeur par défaut
        year: new Date().getFullYear(), // Valeur par défaut
        favorite: false,            // Valeur par défaut
        coverUrl: '/assets/default-cover.jpg' // Valeur par défaut
      });
      
      // Réinitialiser le formulaire
      this.model.set({ 
        title: '', 
        artist: '', 
        rating: 5,
        durationSeconds: 180 
      });
      this.trackForm().reset();
    }
  }
}