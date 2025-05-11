import { Injectable, signal } from '@angular/core';

export interface AuthDataGoogle {
  email?: string;
  firstName: string;
  lastName: string;
  name: string;
  id: string;
  idToken: string;
  photoUrl: string;
  provider: string;
  expiresIn?: number;
  username?: string;
  accessToken?: string;
  picture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageUserService {
  private userSettingsStorageKey = 'auth';

  private _userSettings = signal<AuthDataGoogle | null>(null);
  public readonly userSettings = this._userSettings.asReadonly();

  private _isMobile = signal(false);
  private _showSidebar = signal(false);
  public readonly isMobile = this._isMobile.asReadonly();
  public readonly showSidebar = this._showSidebar.asReadonly();


  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    const userSettingsString = localStorage.getItem(this.userSettingsStorageKey);
    if (userSettingsString) {
      const result = JSON.parse(userSettingsString).userSettings as AuthDataGoogle;
      this._userSettings.set(result);
    }
  }

  setUserSettings(userSettings: AuthDataGoogle) {
    this._userSettings.set(userSettings);
    localStorage.setItem(this.userSettingsStorageKey, JSON.stringify({ userSettings }));
  }

  clearUserSettings() {
    this._userSettings.set(null);
    localStorage.removeItem(this.userSettingsStorageKey);
  }

  setIsMobile(isMobile: boolean) {
    this._isMobile.set(isMobile);
  }
}
