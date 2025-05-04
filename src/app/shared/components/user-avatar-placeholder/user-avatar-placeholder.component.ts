import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-avatar-placeholder',
  imports: [],
  standalone: true,
  templateUrl: './user-avatar-placeholder.component.html',
  styleUrl: './user-avatar-placeholder.component.scss'
})
export class UserAvatarPlaceholderComponent {
  @Input() source!: string | null | undefined;

  public defaultAvatarPath = 'https://www.w3schools.com/howto/img_avatar.png';
  public pathToImage: string | null | undefined = this.defaultAvatarPath;

  ngOnChanges({ source }: SimpleChanges) {
    if (source.currentValue) {
      console.log('source', source);
      this.pathToImage = source.currentValue;
    }
  }
}
