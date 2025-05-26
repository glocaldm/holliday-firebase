import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  GenerateContentRequest,
  GenerateContentResult,
  GenerativeModel,
  getAI,
  getGenerativeModel,
  GoogleAIBackend
} from 'firebase/ai';
import {firebaseApp} from './app.config';
import {AI} from '@angular/fire/ai';
import {from, Observable, of} from 'rxjs';
import {ChatContent} from './chat.store';

@Injectable({providedIn: 'root'})
export class ChatService {
  http = inject(HttpClient)
  private ai: AI;
  private model: GenerativeModel;

  // To generate text output, call generateContent with the text input
  req: GenerateContentRequest = {
    generationConfig: {
      maxOutputTokens: 20,
      temperature: 0,
      candidateCount: 1
    },
    systemInstruction: {text: "You're a poliglot touristic guide for Alicante, Spain"},
    contents: [{role: "user", parts: [{text: "other"}]}]
  }

  constructor() {

    // Initialize the Gemini Developer API backend service
    this.ai = getAI(firebaseApp, {backend: new GoogleAIBackend()});

    // Create a `GenerativeModel` instance with a model that supports your use case
    this.model = getGenerativeModel(this.ai, {model: "gemini-2.0-flash"});
  }

  chat(contents: ChatContent[]): Observable<GenerateContentResult> {
    this.req.contents = contents.map(el => {return {role: el.role, parts: [{text: el.content}]}})
    return from(this.model.generateContent(this.req))
  }

}
