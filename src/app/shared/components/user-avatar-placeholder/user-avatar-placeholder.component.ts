import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-avatar-placeholder',
  imports: [],
  standalone: true,
  templateUrl: './user-avatar-placeholder.component.html',
  styleUrl: './user-avatar-placeholder.component.scss'
})
export class UserAvatarPlaceholderComponent {
  public defaultAvatarPath = 'https://www.w3schools.com/howto/img_avatar.png';
  public pathToImage = this.defaultAvatarPath;

  @Input() set source(value: string | undefined | null) {
    this.pathToImage = value?.trim() ? value : this.defaultAvatarPath;
  }
}
