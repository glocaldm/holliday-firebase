import {Injectable} from '@angular/core';
import {convertIcsCalendar} from 'ts-ics';


export class DateUtil {

  static cast = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes())

  static isEarlier = (a: Date, b: Date): boolean => DateUtil.cast(a) < DateUtil.cast(b)

  static isYesterdayOrEarlier = (a: Date): boolean => {
    const d = new Date();
    d.setDate(d.getDate() - 1)
    return DateUtil.isEarlier(a, d)
  }

  static isLater = (a: Date, b: Date): boolean => DateUtil.cast(a) > DateUtil.cast(b)

  static equalsDownToDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()

  static equalsDownToMinute = (a: Date, b: Date): boolean =>
    DateUtil.equalsDownToDay(a, b)
    && a.getHours() === b.getHours()
    && a.getMinutes() === b.getMinutes()


  static getNights = (start: Date | null, end: Date | null): number => {
    if (!start || !end) {
      return 0
    }
    const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.ceil(Math.abs(endUTC - startUTC) / (1000 * 60 * 60 * 24));
  }

  static getDaysArray = (s: Date,e: Date): Date[] => {
    const a=[];
    for(const d=new Date(s);d<=new Date(e);d.setDate(d.getDate()+1)){
      a.push(new Date(d));
    }
    return a;
  };

  static icsToDates = (rawICS: string) => {
    const evs = convertIcsCalendar(undefined, rawICS).events;
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
  }


}

@Injectable({
  providedIn: 'root'
})
export class DateUtilityService extends DateUtil {
}
