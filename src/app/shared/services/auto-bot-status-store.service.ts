import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoBotStatusStoreService {

  private _statusAutoBot = signal(false);
  public readonly statusAutoBot$ = this._statusAutoBot.asReadonly();

  get statusAutoBotValue(): boolean {
    return this.statusAutoBot$();
  }

  set statusAutoBotValue(value: boolean) {
    this._statusAutoBot.set(value);
  }
}
