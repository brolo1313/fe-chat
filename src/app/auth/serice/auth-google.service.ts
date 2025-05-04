import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthDataGoogle, LocalStorageUserService } from "../../shared/services/local-storage-user.service";
import { environment } from "../../../environments/environment";
import { AuthConfig, OAuthService } from "angular-oauth2-oidc";

@Injectable({
    providedIn: 'root'
})
export class AuthGoogleService {
    user!: any;
    loggedIn!: boolean;

    private http = inject(HttpClient);
    private localStorageService = inject(LocalStorageUserService);
    private oAuthService = inject(OAuthService);

    constructor() {
        this.initConfiguration();

        this.oAuthService.events.subscribe(e => {
            if (e.type === 'token_received') {
                const user = this.getProfile();
                if (user) {
                    this.sendProfileToBackend(user);
                }
            }
        });
    }

    initConfiguration() {
        const authConfig: AuthConfig = {
            issuer: 'https://accounts.google.com',
            strictDiscoveryDocumentValidation: false,
            clientId: '64531276471-rsgodsdm2879qssn0kvo3pkmtni0q1d5.apps.googleusercontent.com',
            redirectUri: window.location.origin,
            scope: 'openid profile email',
        };

        this.oAuthService.configure(authConfig);
        this.oAuthService.setupAutomaticSilentRefresh();
        this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    }

    login() {
        this.oAuthService.initImplicitFlow();
    }

    logout() {
        this.oAuthService.revokeTokenAndLogout();
        this.oAuthService.logOut();
    }

    getProfile() {
        const profile = this.oAuthService.getIdentityClaims();
        return profile;
    }

    getToken() {
        return this.oAuthService.getAccessToken();
    }


    private sendProfileToBackend(user: any) {
        console.log('user', user);
        const payload = {
            name: user.name,
            email: user.email,
            picture: user.picture,
            sub: user.sub, 
        };

        this.http.post<AuthDataGoogle>(`${environment.apiUrl}/auth/google/callback`, payload)
            .subscribe({
                next: (response: AuthDataGoogle) => {
                    console.log('sendProfileToBackend response', response);
                    this.localStorageService.setUserSettings(response);
                },
                error: (error) => {
                    console.log('sendProfileToBackend error', error);
                }
            });
    }
}