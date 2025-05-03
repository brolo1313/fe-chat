import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fe-chat';
}
