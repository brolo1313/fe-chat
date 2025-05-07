import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-google-login-button',
  imports: [CommonModule],
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss']
})
export class GoogleLoginButtonComponent {
  @Input() isLoggedIn = false;
  @Output() loginClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  onClick(): void {
    this.isLoggedIn ? this.logoutClick.emit() : this.loginClick.emit();
  }
}
