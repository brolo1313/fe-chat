import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar-placeholder',
  imports: [],
  standalone: true,
  templateUrl: './user-avatar-placeholder.component.html',
  styleUrl: './user-avatar-placeholder.component.scss'
})
export class UserAvatarPlaceholderComponent {
  @Input() source!: string;

  public defaultAvatarPath = 'https://www.w3schools.com/howto/img_avatar.png';
}
