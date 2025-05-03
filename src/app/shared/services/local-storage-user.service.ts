import { Injectable } from '@angular/core';

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
}

@Injectable({
    providedIn: 'root'
})
export class LocalStorageUserService {

    private userSettingsStorageKey: string = 'auth';

    getUserSettings() {
        const userSettingsString = localStorage.getItem(this.userSettingsStorageKey);
        if (userSettingsString) {
            return { ...JSON.parse(userSettingsString).userSettings };
        }
        return false;
    }
    setUserSettings(userSettings: AuthDataGoogle) {
        localStorage.setItem(this.userSettingsStorageKey, JSON.stringify({ userSettings: userSettings }));
    }

}
