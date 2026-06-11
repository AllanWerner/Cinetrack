// src/app/app.ts — Énoncé spécial
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected auth = inject(AuthService);

  /** Feature flag lu depuis l'environnement — contrôle le lien nav Favoris */
  protected readonly favoritesEnabled = environment.features?.favorites ?? true;
}
