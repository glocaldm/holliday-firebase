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
    return this.http
      .get<string>(
        `https://ical-booking-com-dados-inn-lelnokmu7a-ew.a.run.app`,
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
