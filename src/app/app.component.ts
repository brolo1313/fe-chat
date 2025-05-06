import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { LocalStorageUserService } from './shared/services/local-storage-user.service';
import { SocketService } from './socket/socket.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, ChatWindowComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fe-chat';

  constructor(private localStorageUserService: LocalStorageUserService, private socketService: SocketService) {
  }

  ngOnInit() {
    const userSettings = this.localStorageUserService.userSettings();

    if (userSettings?.accessToken) {
      this.socketService.connect(userSettings.accessToken);
    }
  }
}
