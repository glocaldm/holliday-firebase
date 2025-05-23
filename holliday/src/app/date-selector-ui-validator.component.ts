import {DateUtilityService} from "./date.utility.service";

export abstract class DateSelectorUiValidatorComponent {

  protected MONTH_OFFSET = 1;
  protected availabilityDates: Array<Date> = new Array<Date>();
  viewDateA: Date = new Date();
  viewDateB: Date = new Date();

  constructor(
  ) {
    this.viewDateB.setMonth(new Date().getMonth() + this.MONTH_OFFSET)
  }

  isTransparent = (date: Date): boolean => DateUtilityService.isYesterdayOrEarlier(date)
  isCrossedOut = (date: Date): boolean => this.availabilityDates.some(d => DateUtilityService.equalsDownToDay(date, d))
  dateClass = (cellDate: Date | undefined, view: 'month' | 'year' | 'multi-year'): string[] =>
    cellDate && (this.isTransparent(cellDate) || this.isCrossedOut(cellDate)) ? ['transparent-date'] : [];
  dateFilter = (cellDate: Date): boolean => !(this.isTransparent(cellDate) || this.isCrossedOut(cellDate))
}
