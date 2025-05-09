import { inject, Injectable, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  public className = signal('');

  private readonly duration = 4000;

  showToaster(toastState: string, toastMessage: string , delay: number = this.duration, className: string = ''): void {
    const sanitized = this.domSanitizer.bypassSecurityTrustHtml(toastMessage);
    this.className.set(className);
    this.showToast.set(true);
    this.toastState.set(toastState);
    this.toastMessage.set(sanitized);
    setTimeout(() => this.showToast.set(false), delay);
  }

  dismissToast(): void {
    this.showToast.set(false);
  }
}
