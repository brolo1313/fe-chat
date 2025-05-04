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
    private userSettingsStorageKey: string = 'auth';

    private userSettings = signal<AuthDataGoogle | null>(null);
    public userSettings$ = this.userSettings.asReadonly();


    getUserSettings() {
        const userSettingsString = localStorage.getItem(this.userSettingsStorageKey);
        if (userSettingsString) {
            const result = { ...JSON.parse(userSettingsString).userSettings }
            this.userSettings.set(result)
            return result;
        }
        return false;
    }
    setUserSettings(userSettings: AuthDataGoogle) {
        this.userSettings.set(userSettings)
        localStorage.setItem(this.userSettingsStorageKey, JSON.stringify({ userSettings: userSettings }));
    }

    clearUserSettings() {
        this.userSettings.set(null);
        localStorage.removeItem(this.userSettingsStorageKey);
    }

}
