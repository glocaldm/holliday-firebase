import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  DateRange,
  MatCalendar,
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { Loader } from '@googlemaps/js-api-loader';
import { QRCodeComponent } from 'angularx-qrcode';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareBottomSheetComponent } from '../share-bottom-sheet/share-bottom-sheet.component';
import {
  AvailabilitiesState,
  bookDateChange,
  getAvailabilityDates,
  isBookingValid,
  selectAvailabilityDates,
  selectBooking,
  selectDateRange,
} from '../../availabilities.store';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { DateSelectorUiValidatorComponent } from '../../date-selector-ui-validator.component';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import {
  GalleryConfig,
  GalleryItem,
  SimpleGalleryDirective,
} from 'ngx-simple-gallery';
import {ChatComponent} from '../chat/chat.component';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatCalendar,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerToggle,
    MatInput,
    MatDatepickerInput,
    MatDatepicker,
    QRCodeComponent,
    ChatComponent,
    MatIconModule,
    SimpleGalleryDirective,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent
  extends DateSelectorUiValidatorComponent
  implements OnInit
{
  featureBot = false;
  readonly dialog = inject(MatDialog);

  @ViewChild('calendarA')
  calendarA!: MatCalendar<Date>;
  @ViewChild('calendarB')
  calendarB!: MatCalendar<Date>;
  @ViewChild('checkinPicker')
  checkInPicker!: MatCalendar<Date>;
  @ViewChild('checkOutPicker')
  checkOutPicker!: MatCalendar<Date>;
  @Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>();
  selectedRangeValue: DateRange<Date> | Date | null = null;
  availabilityDates$: Observable<Array<Date>>;

  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  private checkInDate$: Observable<Date | null>;
  private checkOutDate$: Observable<Date | null>;
  selectedRangeValue$: Observable<DateRange<Date>>;
  isBookingValid$: Observable<boolean>;

  // maps start
  private loader: Loader;
  // @ts-ignore
  options: google.maps.MapOptions = {
    center: { lat: 38.2243, lng: -0.5186 },
    zoom: 15,
    mapId: 'myId',
  };
  // @ts-ignore
  map: google.maps.Map;
  // maps end

  store = inject(Store<AvailabilitiesState>);
  private _bottomSheet = inject(MatBottomSheet);

  constructor(public auth: AuthService, private http: HttpClient) {
    super();
    this.viewDateB.setMonth(new Date().getMonth() + this.MONTH_OFFSET);
    this.store.dispatch(
      getAvailabilityDates({ start: this.viewDateA, end: this.viewDateB })
    );
    this.availabilityDates$ = this.store.select(selectAvailabilityDates);
    this.availabilityDates$.subscribe((dates) => this.updateDates(dates));
    this.selectedRangeValue$ = this.store.select(selectDateRange);
    this.selectedRangeValue$.subscribe((d) => {
      this.selectedRangeValue = d;
      this.selectedRangeValueChange.emit(this.selectedRangeValue);
    });
    this.checkInDate$ = this.store
      .select(selectBooking)
      .pipe(map((b) => b.start));
    this.checkInDate$.subscribe((d) => (this.checkInDate = d));
    this.checkOutDate$ = this.store
      .select(selectBooking)
      .pipe(map((b) => b.end));
    this.checkOutDate$.subscribe((d) => (this.checkOutDate = d));
    this.isBookingValid$ = this.store.select(isBookingValid);

    this.loader = new Loader({
      apiKey: 'AIzaSyAI9GZiqE3Cz_LaKBcqvINvlYOr2eraeLY',
      version: 'weekly',
      libraries: ['maps', 'marker'],
    });
  }

  updateDates = (dates: Array<Date>): void => {
    this.availabilityDates = dates;
    if (this.calendarA && this.calendarB) {
      this.calendarA.updateTodaysDate();
      this.calendarB.updateTodaysDate();
    }
    if (this.checkInPicker && this.checkOutPicker) {
      this.checkInPicker.updateTodaysDate();
      this.checkOutPicker.updateTodaysDate();
    }
  };

  selectedChange(m: any) {
    this.store.dispatch(bookDateChange({ date: m }));
  }

  onCheckInDateChange($event: any /*MatDatepickerInputEvent<Date>*/) {
    this.selectedChange($event.value);
  }

  onCheckOutDateChange($event: any /*MatDatepickerInputEvent<Date>*/) {
    this.selectedChange($event.value);
  }

  ngOnInit(): void {
    this.loader
      .importLibrary('maps')
      .then(({ Map }) => {
        const el = document.getElementById('map');
        if (el) {
          this.map = new Map(el, this.options);
        }
      })
      .catch((e) => {
        // do something
      });

    this.loader
      .importLibrary('marker')
      .then(({ AdvancedMarkerElement }) => {
        if (this.map) {
          new AdvancedMarkerElement({
            map: this.map,
            position: this.options.center,
            gmpClickable: true,
            title: 'Welcome Home',
          });
        }
      })
      .catch((e) => {
        // do something
      });
  }

  onShareButtonClick($event: any): void {
    this._bottomSheet.open(ShareBottomSheetComponent);
  }

  onBookingClick($event: MouseEvent) {
    console.log('not implemented');
  }

  images = [
    'beach-1-450-450.jpg',
    'single-near-225-225.jpg',
    'kitchen-wide-225-225.jpg',
    'beach-1-450-450.jpg',
    'living-wide-225-225.jpg',
    'view-1-225-225.jpg',
    'beach-1-450-450.jpg',
    'single-near-225-225.jpg',
    'kitchen-wide-225-225.jpg',
    'beach-1-450-450.jpg',
    'living-wide-225-225.jpg',
    'beach-1-450-450.jpg',
    'view-1-225-225.jpg',
    'beach-1-450-450.jpg',
    'single-near-225-225.jpg',
    'kitchen-wide-225-225.jpg',
    'beach-1-450-450.jpg',
    'living-wide-225-225.jpg',
    'beach-1-450-450.jpg',
    'view-1-225-225.jpg',
  ];
  galleryItems: GalleryItem[] = this.images.map((i) => {
    return { src: i };
  });
  galleryConfig: GalleryConfig = {
    emptyMessage: 'No images found in the galleryItems',
    galleryThumbnailSize: 140,
    modalStartIndex: 2,
    showModalThumbnailList: false,
  };

  onImagesSectionEvent($event: MouseEvent) {
    console.log('onImagesSectionEvent', $event);
  }
}
