import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DateUtil } from './date.utility.service';
import { convertIcsCalendar } from 'ts-ics';

@Injectable({
  providedIn: 'root',
})
export class AvailabilitiesService {
  constructor(private http: HttpClient) {}

  getAvailabilities(): Observable<Array<Date>> {
    if (isDevMode()) {
      return this.http
        .get<string>('http://localhost:4200/latest.ical', {
          responseType: 'text' as 'json',
        })
        .pipe(
          map((d) => {
            const evs = convertIcsCalendar(undefined, d).events;
            if (evs !== undefined) {
              return evs.flatMap((ev) => {
                if (ev.end !== undefined) {
                  return DateUtil.getDaysArray(ev.start.date, ev.end.date);
                } else {
                  return [ev.start.date];
                }
              });
            } else {
              return [];
            }
          })
        );
    }
    return this.http
      .get<string>(
        `https://dados-inn-availabilities-fn-988592407000.europe-west3.run.app/`,
        { responseType: 'text' as 'json' }
      )
      .pipe(
        map((d) => {
          const evs = convertIcsCalendar(undefined, d).events;
          if (evs !== undefined) {
            return evs.flatMap((ev) => {
              if (ev.end !== undefined) {
                return DateUtil.getDaysArray(ev.start.date, ev.end.date);
              } else {
                return [ev.start.date];
              }
            });
          } else {
            return [];
          }
        })
      );
  }
}
