import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, EMPTY, exhaustMap, map, tap, withLatestFrom} from 'rxjs';
import {Store} from '@ngrx/store';
import {AvailabilitiesService} from './availabilities.service';
import {
  AvailabilitiesState,
  bookDateStart,
  bookDateValidate,
  getAvailabilityDates,
  getAvailabilityDatesSuccess,
  selectBooking,
} from './availabilities.store';
import {chatActions, chatSelectors, ChatState} from './chat.store';
import {ChatService} from './chat.service';
import {GenerateContentResult} from 'firebase/ai';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class ChatEffects {
  actions$ = inject(Actions)
  store = inject(Store<ChatState>)
  chatService = inject(ChatService)

  onUserPromptGetBotResponse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.userPrompt),
      withLatestFrom(this.store.select(chatSelectors.selectAll)),
      switchMap(([prompt, chatContents]) =>
        this.chatService.chat(chatContents).pipe(map(generatedContentResult => chatActions.botOutput(generatedContentResult))))
    )
  )
}
