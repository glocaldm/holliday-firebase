import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { availabilitiesReducer } from './availabilities.store';
import { AvailabilitiesEffects } from './availabilities.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AvailabilitiesService } from './availabilities.service';
import { DateUtilityService } from './date.utility.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {AuthService} from './auth.service';
import {AuthInterceptor} from './auth.interceptor';
import {chatReducer} from './chat.store';
import {ChatEffects} from './chat.effects';
import {initializeAppCheck, provideAppCheck, ReCaptchaV3Provider} from '@angular/fire/app-check';
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
export const firebaseApp = initializeApp(firebaseConfig);
// Initialize App Check
// Replace 'YOUR_RECAPTCHA_ENTERPRISE_SITE_KEY' with your actual key
// Make sure you've registered your web app in App Check in the Firebase Console
// and configured reCAPTCHA Enterprise for your Firebase project.
// isDebug = true allows testing locally/on non-registered domains (DO NOT USE IN PRODUCTION)
const appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider('6LcdUEgrAAAAALZo_pZ9hZgc_4AhSO-zMn_gxFCt'),
    // isTokenAutoRefreshEnabled: true
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ booking: availabilitiesReducer, chat: chatReducer }),
    provideEffects([AvailabilitiesEffects, ChatEffects]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideFirebaseApp(() => firebaseApp),
    provideAppCheck(() => appCheck),
    provideAuth(() => getAuth()),
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AvailabilitiesService,
    DateUtilityService,
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
  ],
};
