import { Injectable, signal } from '@angular/core';
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

  public showToast = signal(false);
  public toastMessage = signal('Default Toast Message');
  public toastState = signal(TOAST_STATE.success);

  private readonly duration = 3000;

  showToaster(toastState: string, toastMessage: string): void {
    console.log('showtoaster apear');
    this.showToast.set(true);
    this.toastState.set(toastState);
    this.toastMessage.set(toastMessage);
    setTimeout(() => this.showToast.set(false), this.duration);
  }

  dismissToast(): void {
    this.showToast.set(false);
  }
}
