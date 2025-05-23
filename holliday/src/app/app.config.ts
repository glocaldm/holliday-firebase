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

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsymDPQPiWfhrsou6V46AEH7v2hqt8C3E",
  authDomain: "holliday-dados-inn.firebaseapp.com",
  projectId: "holliday-dados-inn",
  storageBucket: "holliday-dados-inn.firebasestorage.app",
  messagingSenderId: "375600436425",
  appId: "1:375600436425:web:e671f9f589c8195681e918"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ booking: availabilitiesReducer }),
    provideEffects([AvailabilitiesEffects]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
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
