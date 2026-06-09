// track-form.ts
import { Component, signal, output } from '@angular/core';
import { form, FormField, required, min, max } from '@angular/forms/signals';

@Component({
  selector: 'app-track-form',
  imports: [FormField],
  templateUrl: './track-form.html',
  styleUrl: './track-form.css',
})
export class TrackForm {
  // Définition de l'output
  add = output<{ title: string; artist: string; rating: number; durationSeconds?: number }>();

  protected model = signal({ title: '', artist: '', rating: 5 });

  protected trackForm = form(this.model, (path) => {
    required(path.title, { message: 'Le titre est requis' });
    required(path.artist, { message: "L'artiste est requis" });
    min(path.rating, 0);
    max(path.rating, 10);
  });

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.trackForm().valid()) {
      // Émettre la nouvelle piste
      this.add.emit({
        title: this.model().title,
        artist: this.model().artist,
        rating: this.model().rating,
        durationSeconds: 180, // Valeur par défaut 
      });
      
      // réinitialiser le formulaire
      this.model.set({ title: '', artist: '', rating: 5 });
      this.trackForm().reset();
    }
  }
}