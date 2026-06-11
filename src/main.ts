import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './app/app';
import { authInterceptor } from './app/interceptors/auth.interceptor'; //on ajoute l'intercepteur d'authentification

bootstrapApplication(App, {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
});