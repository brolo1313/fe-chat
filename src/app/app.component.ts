import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { LocalStorageUserService } from './shared/services/local-storage-user.service';
import { SocketService } from './socket/socket.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ResizerScreenComponent } from './shared/components/resizer-screen/resizer-screen.component';
import { CommonModule } from '@angular/common';
import { AuthGoogleService } from './auth/serice/auth-google.service';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, ChatWindowComponent, ToastComponent, ResizerScreenComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private localStorageUserService = inject(LocalStorageUserService);
  private socketService = inject(SocketService);
  private auth = inject(AuthGoogleService);

  title = 'fe-chat';
  leftSideBarWidth: number = 500;

  ngOnInit() {
    this.auth.pingServer();
    const userSettings = this.localStorageUserService.userSettings();

    if (userSettings?.accessToken) {
      this.socketService.connect(userSettings.accessToken);
    }
  }

  onResize(event: any) {
    this.leftSideBarWidth = event;
  }

}
