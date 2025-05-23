import {createAction, createFeatureSelector, createReducer, createSelector, on, props} from "@ngrx/store";
import {DateRange} from "@angular/material/datepicker";
import { DateUtil } from './date.utility.service';

export enum PaymentMethod {
  PayPal, BankCard, Visa, Mastercard, AmericanExpress
}
export interface IPaymentMethod {
  type: PaymentMethod
}
export interface IPaymentMethodState {
  paymentMethods: Array<IPaymentMethod>,
  current: IPaymentMethod
}
export const MAX_GUESTS = 4;
export const MIN_ADULTS = 1;
export interface IFee {
  type: 'cleaning' | 'cancelation'
  fee: number
}
export interface IRate {
  start: string;
  end: string;
  rate: number;
  currency: string;
  fees: Array<IFee>
}

export interface IRates {
  rates: Array<IRate>
}

export interface AvailabilitiesState {
  availability: Array<Date>
  start: Date | null,
  end: Date | null,
  rates: IRates | null,
  adults: number,
  children: number,
}

const initialState: AvailabilitiesState = {
  availability: [],
  start: null,
  end: null,
  rates: null,
  adults: MIN_ADULTS,
  children: 0
};

export const bookDateStart = createAction('[Book Date] Start', props<{ date: Date | null }>());
export const bookDateEnd = createAction('[Book Date] End', props<{ date: Date | null }>());
export const bookDateChange = createAction('[Book Date] Change', props<{ date: Date | null }>());
export const bookDateValidate = createAction('[Book Date] Validate', props<{ date: Date | null }>());
export const bookDateReset = createAction('[Book Date] Reset');
export const bookDateAdults = createAction('[Book Date] Adults', props<{ adults: number }>());
export const bookDateChildren = createAction('[Book Date] Children', props<{ children: number }>());
export const getAvailabilityDates = createAction('[Book Dates] fetch availability', props<{ start: Date, end: Date }>());
export const getAvailabilityDatesSuccess = createAction('[Book Dates] fetch availability success', props<{ dates: Array<Date> }>());
export const getPrices = createAction('[Book Prices] start end', props<{ start: Date, end: Date }>());
export const getPricesSuccess = createAction('[Book Prices] fetch start end success', props<{ rates: IRates }>());
export const getPricesError = createAction('[Book Prices] start end error', props<{ error: string }>());

export const getPaymentMethods = createAction('[Payment Methods] fetch');
export const setCurrentPaymentMethod = createAction('[Payment Methods] set setCurrentPaymentMethod', props<{ paymentMethod: IPaymentMethod}>());
export const getPaymentMethodsSuccess = createAction('[Payment Methods] fetch success', props<{ paymentMethods: Array<IPaymentMethod> }>());
export const getPaymentMethodsError = createAction('[Payment Methods] fetch error', props<{ error: string }>());

export const isAnyDateBookedOrInPast = (test: Array<Date>, bookedDates: Array<Date>): boolean => {
  return test.some(day =>
    DateUtil.isYesterdayOrEarlier(day) ||
    bookedDates.some(booked => DateUtil.equalsDownToDay(booked, day)))
}

export const isOverBooking = (start: Date | null, end: Date | null, bookedDates: Array<Date>): boolean => {
  if(start && end){
    return isAnyDateBookedOrInPast(DateUtil.getDaysArray(start, end), bookedDates)
  }
  else if (start && !end){
    return isAnyDateBookedOrInPast(DateUtil.getDaysArray(start, start), bookedDates)
  }
  else if (end && !start){
    return isAnyDateBookedOrInPast(DateUtil.getDaysArray(end, end), bookedDates)
  }
  else {
    return false
  }
}

const onBookDateStartOrEnd = (change: Date | null, state: AvailabilitiesState): DateRange<Date> => {
  // no change or collision, same state
  if (change === null) return new DateRange<Date>(state.start, state.end);
  if ( !state.start ||
    state.end ||
    isOverBooking(state.start, change, state.availability) ||
    change < state.start
  ) return new DateRange<Date>(change, null);
  return new DateRange<Date>(state.start, change);

}

export const availabilitiesReducer = createReducer(
  initialState,
  on(bookDateStart, (state: AvailabilitiesState, {date}): AvailabilitiesState => {
    const range = onBookDateStartOrEnd(date, state)
    return {
      ...state,
      start: range.start,
      end: range.end
    }
  }),
  on(bookDateEnd, (state: AvailabilitiesState, {date}): AvailabilitiesState => {
    const range = onBookDateStartOrEnd(date, state)
    return {
      ...state,
      start: range.start,
      end: range.end
    }
  }),
  on(bookDateChange, (state: AvailabilitiesState, {date}): AvailabilitiesState => {
    const range = onBookDateStartOrEnd(date, state)
    return {
      ...state,
      start: range.start,
      end: range.end
    }
  }),
  on(bookDateReset, (state: AvailabilitiesState): AvailabilitiesState => {
    return {
      ...state,
      start: null,
      end: null
    }
  }),
  on(bookDateAdults, (state: AvailabilitiesState, {adults}): AvailabilitiesState => {
    return {
      ...state,
      adults: checkConstraints(state.adults, adults, state.children, 0)
    }
  }),
  on(bookDateChildren, (state: AvailabilitiesState, {children}): AvailabilitiesState => {
    return {
      ...state,
      children: checkConstraints(state.adults, 0, state.children, children)
    }
  }),
  on(getAvailabilityDatesSuccess, (state: AvailabilitiesState, {dates}): AvailabilitiesState => {
    return {
      ...state,
      availability: dates
    }
  }),
  on(getPricesSuccess, (state: AvailabilitiesState, {rates}): AvailabilitiesState => {
    return {
      ...state,
      rates: rates
    }
  })
);
const checkConstraints = (originalAdults: number, newAdults: number, originalChildren: number, newChildren: number): number => {
  const adults = originalAdults + newAdults
  const children = originalChildren + newChildren
  const allGuests = originalAdults + newAdults + originalChildren + newChildren
  if (newChildren === 0) { // changing adults
    return (adults >= MIN_ADULTS) && (allGuests <= MAX_GUESTS) ?
      originalAdults + newAdults : originalAdults
  } else { // changing children
    return (adults >= MIN_ADULTS) && (allGuests <= MAX_GUESTS) && (children >= 0) ?
      originalChildren + newChildren : originalChildren
  }
}
export const selectBookings = createFeatureSelector<AvailabilitiesState>('booking');
export const selectBooking = createSelector(
  selectBookings,
  (booking): AvailabilitiesState =>
    booking
);
export const selectDateRange = createSelector(
  selectBookings,
  (booking): DateRange<Date> => new DateRange(booking.start, booking.end)
);
export const selectAvailabilityDates = createSelector(
  selectBookings,
  (booking): Array<Date> =>
    booking.availability ? booking.availability : []
);
export const selectPrice = createSelector(
  selectBookings,
  (booking): IRate | null => {
    return {
      start: booking.start ? booking.start.toString() : new Date().toString(),
      end: booking.end ? booking.end.toString() : new Date().toString(),
      rate: 100,
      currency: 'EUR',
      fees: [{type: "cleaning", fee: 30}]
    };
  }
)
export const selectPricePerNight = createSelector(
  selectPrice,
  (price): number =>
    price ? price.rate / DateUtil.getNights(new Date(price.start), new Date(price.end)) : 0
)

export const isBookingValid = createSelector(
  selectBookings,
  (booking): boolean => {
    return !!booking.start && !!booking.end && !isOverBooking(booking.start, booking.end, booking.availability)
  }
);

const initialaPymentMethodState: IPaymentMethodState = {paymentMethods: [], current: {type: PaymentMethod.BankCard}};
export const paymentMethodReducer = createReducer(
  initialaPymentMethodState,
  on(getPaymentMethodsSuccess, (state, {paymentMethods}): IPaymentMethodState => {
    return {
      ...state,
      paymentMethods: paymentMethods
    }
  }),
  on(setCurrentPaymentMethod, (state, {paymentMethod}): IPaymentMethodState => {
    return {
      ...state,
      current: paymentMethod
    }
  })

)

export const selectPaymentMethodState = createFeatureSelector<IPaymentMethodState>('paymentMethods')
export const selectPaymentMethods = createSelector(
  selectPaymentMethodState,
  (state): Array<IPaymentMethod> => state.paymentMethods
)
