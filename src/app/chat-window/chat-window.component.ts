import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, UserAvatarPlaceholderComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {

  public messageControl = new FormControl('', [Validators.required])

  public selectedChat = {
    id: 1,
    name: 'John Doe',
    imagePath: 'assets/images/chat-user-placeholder.jpg',
    messages: [
      { content: 'Hello!', isOwn: true, time: '10:00 AM', date: '2023-10-01' },
      { content: 'Hi there!', isOwn: false, time: '10:00 AM', date: '2023-10-01' },
      { content: 'How are you?', isOwn: true, time: '10:00 AM', date: '2023-10-01' },
      { content: 'I am fine, thank you!', isOwn: false, time: '10:00 AM', date: '2023-10-01' }
    ]
  }

  get messageFC() {
    return this.messageControl.value;
  }
  sendMessage() {
    const msg = this.messageFC;
    this.messageControl.reset();
    console.log('Sending message:', msg);
  }

  onKeyDownEvent(event: any) {
    console.log('event', event);
    const msg = this.messageFC;
    this.messageControl.reset();
    console.log('Sending message:', msg);
  }



}
