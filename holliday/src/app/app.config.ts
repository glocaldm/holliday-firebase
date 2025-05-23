import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { availabilitiesReducer } from './availabilities.store';
import { AvailabilitiesEffects } from './availabilities.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AvailabilitiesService } from './availabilities.service';
import { DateUtilityService } from './date.utility.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ booking: availabilitiesReducer }),
    provideEffects([AvailabilitiesEffects]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyDYCZKPmsfpRY8BOA_898XLghR2sqs4Frw',
        authDomain: 'dados-inn.firebaseapp.com',
        projectId: 'dados-inn',
        storageBucket: 'dados-inn.firebasestorage.app',
        messagingSenderId: '537391388102',
        appId: '1:537391388102:web:6838704433f61460dd0ec7',
        measurementId: 'G-N5WYB9LGDT',
      })
    ),
    provideAuth(() => getAuth()),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    AvailabilitiesService,
    DateUtilityService,
  ],
};
