import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, ChatWindowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fe-chat';
}
