import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';

@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, UserAvatarPlaceholderComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {

  public newMessage = '';

  public selectedChat = {
    id: 1,
    name: 'John Doe',
    imagePath: 'assets/images/chat-user-placeholder.jpg',
    messages: [
      { content: 'Hello!' , isOwn: true, time: '10:00 AM', date: '2023-10-01' },
      { content: 'Hi there!' , isOwn: false,  time: '10:00 AM', date: '2023-10-01'  },
      { content: 'How are you?' , isOwn: true,  time: '10:00 AM', date: '2023-10-01'  },
      { content: 'I am fine, thank you!' , isOwn: false ,  time: '10:00 AM', date: '2023-10-01' }
    ]
  }

  sendMessage() {
    console.log('Sending message:', this.newMessage);
  }

}
