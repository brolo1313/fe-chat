import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar-placeholder',
  imports: [],
  standalone: true,
  templateUrl: './user-avatar-placeholder.component.html',
  styleUrl: './user-avatar-placeholder.component.scss'
})
export class UserAvatarPlaceholderComponent {
  @Input() source: string = 'assets/images/chat-user-placeholder.jpg';
}
