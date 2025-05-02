import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  
  public chats = [
    {
      id: 1,
      name: 'Chat 1',
      lastMessage: 'Hello!',
      time: '10:00 AM',
      date: '2023-10-01',
      imagePath: 'assets/images/chat-user-placeholder.jpg'
    },
    {
      id: 2,
      name: 'Chat 2',
      lastMessage: 'How are you?',
      time: '10:05 AM',
      date: '2023-10-01',
      imagePath: 'assets/images/chat-user-placeholder.jpg'
    },
    {
      id: 3,
      name: 'Chat 3',
      lastMessage: 'Goodbye!',
      time: '10:10 AM',
      date: '2023-10-01',
      imagePath: 'assets/images/chat-user-placeholder.jpg'
    }
  ]
}
