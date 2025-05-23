import { APP_BASE_HREF } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-share-bottom-sheet',
  imports: [MatBottomSheetModule, QRCodeComponent],
  templateUrl: './share-bottom-sheet.component.html',
  styleUrl: './share-bottom-sheet.component.scss',
})
export class ShareBottomSheetComponent {
  private _bottomSheetRef =
    inject<MatBottomSheetRef<ShareBottomSheetComponent>>(MatBottomSheetRef);

  open(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  protected readonly APP_BASE_HREF = APP_BASE_HREF;
}
