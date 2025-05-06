import { inject, Injectable, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

export const TOAST_STATE = {
  success: 'success-toast',
  warning: 'warning-toast',
  danger: 'danger-toast'
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private domSanitizer = inject(DomSanitizer);
  public showToast = signal(false);
  public toastMessage = signal<SafeHtml>('Default Toast Message');
  public toastState = signal(TOAST_STATE.success);

  private readonly duration = 3000;

  showToaster(toastState: string, toastMessage: string): void {
    console.log('showtoaster apear');
    const sanitized = this.domSanitizer.bypassSecurityTrustHtml(toastMessage);
    this.showToast.set(true);
    this.toastState.set(toastState);
    this.toastMessage.set(sanitized);
    setTimeout(() => this.showToast.set(false), this.duration);
  }

  dismissToast(): void {
    this.showToast.set(false);
  }
}
