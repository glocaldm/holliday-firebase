import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, exhaustMap, map, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AvailabilitiesService } from './availabilities.service';
import {
  AvailabilitiesState,
  bookDateStart,
  bookDateValidate,
  getAvailabilityDates,
  getAvailabilityDatesSuccess,
  selectBooking,
} from './availabilities.store';

@Injectable()
export class AvailabilitiesEffects {
  actions$ = inject(Actions)
  store = inject(Store<AvailabilitiesState>)
  availabilitiesService = inject(AvailabilitiesService)

  validateDateSelection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(bookDateValidate),
      withLatestFrom(
        this.store.select(selectBooking),
        ({ date }, bookDateState) => {
          return bookDateStart({ date });
        }
      )
    )
  );

  availabilityDates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAvailabilityDates),
      exhaustMap(({ start, end }) =>
        this.availabilitiesService.getAvailabilities().pipe(
          map((dates) => getAvailabilityDatesSuccess({ dates })),
          catchError(() => EMPTY)
        )
      )
    )
  );
}
