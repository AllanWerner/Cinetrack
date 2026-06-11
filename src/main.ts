// src/main.ts  — F11 + F12 + F13
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { App } from './app/app';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { errorInterceptor } from './app/interceptors/error.interceptor'; 

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),                                            
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),         
    ),
  ],
});
