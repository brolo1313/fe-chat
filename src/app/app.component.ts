import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { LocalStorageUserService } from './shared/services/local-storage-user.service';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, ChatWindowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fe-chat';

  constructor(private localStorageUserService: LocalStorageUserService) {
    this.localStorageUserService.userSettings();
  }
}
