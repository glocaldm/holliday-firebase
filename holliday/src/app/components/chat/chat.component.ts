import { Component, OnInit } from '@angular/core';
// import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  chatForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      message: [''],
    });
  }

  // private engine!: MLCEngine;

  messages: { role: string; content: string }[] = [];

  sendMessage() {
    const userMessage = this.chatForm.value.message || '';
    if (!userMessage.trim()) return;

    this.messages.push({ role: 'user', content: userMessage });
    this.chatForm.reset();
    setTimeout(() => {
      this.messages.push({ role: 'assistant', content: 'content bot' });
    }, 1000);
    // https://dados-inn-infos-fn-988592407000.europe-west3.run.app
    // this.chatService.sendMessage(userMessage).subscribe(response => {
    //   const botReply = response.choices[0].message.content;
    //   this.messages.push({ role: 'assistant', content: botReply });
    // });
  }

  ngOnInit(): void {
    // web.dev/articles/ai-chatbot-webllm</p>
    // check if local gpu else use api
    console.log('not loading model');
    // this.loadModel();
  }

  async loadModel() {
    // this.engine = await CreateMLCEngine('Llama-3.2-3B-Instruct-q4f32_1-MLC', {
    //   initProgressCallback: ({ progress }) => console.log(progress),
    // });
  }
}
