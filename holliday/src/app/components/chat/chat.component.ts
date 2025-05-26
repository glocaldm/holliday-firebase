import {Component, inject, OnInit} from '@angular/core';
// import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Store} from '@ngrx/store';
import {chatActions, ChatContent, chatSelectors, ChatState} from '../../chat.store';
import {filter, Observable} from 'rxjs';
import {AuthService} from '../../auth.service';
import {Auth} from '@angular/fire/auth';

@Component({
  selector: 'app-chat',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  messages: { role: string; content: string }[] = [];
  chatForm: FormGroup;
  chatStore: Store<ChatState> = inject(Store<ChatState>)
  private botMessage$: Observable<ChatContent[]>;
  private auth = inject(Auth)
  // private engine!: MLCEngine;

  constructor(private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      message: [''],
    });
    this.botMessage$ = this.chatStore.select(chatSelectors.selectAll)
    this.botMessage$.subscribe(chatContents => this.updateChatMessages(chatContents))
  }

  private updateChatMessages(chatContents: ChatContent[]) {
    if(chatContents.length > 0) this.messages.push({role: chatContents.at(-1)!.role, content: chatContents.at(-1)!.content});
  }

  sendMessage() {
    const userMessage = this.chatForm.value.message || '';
    if (!userMessage.trim() || !this.auth.currentUser) return;
    const content: ChatContent = {role: 'user', content: userMessage}
    this.chatStore.dispatch(chatActions.userPrompt(content))
    this.chatForm.reset();
  }

  ngOnInit(): void {
    // web.dev/articles/ai-chatbot-webllm</p>
    // check if local gpu else use api
    // console.log('not loading model');
    // this.loadModel();
  }

  async loadModel() {
    // this.engine = await CreateMLCEngine('Llama-3.2-3B-Instruct-q4f32_1-MLC', {
    //   initProgressCallback: ({ progress }) => console.log(progress),
    // });
  }
}
