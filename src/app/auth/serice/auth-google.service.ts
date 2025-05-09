import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AuthDataGoogle, LocalStorageUserService } from "../../shared/services/local-storage-user.service";
import { environment } from "../../../environments/environment";
import { AuthConfig, OAuthService } from "angular-oauth2-oidc";
import { SocketService } from "../../socket/socket.service";
import { TOAST_STATE, ToastService } from "../../shared/services/toast.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGoogleService {
    user!: any;
    loggedIn!: boolean;

    private http = inject(HttpClient);
    private socketService = inject(SocketService);
    private localStorageService = inject(LocalStorageUserService);
    private oAuthService = inject(OAuthService);
    private toastService = inject(ToastService);

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
            clientId: environment.googleClientId,
            redirectUri: environment.webUri,
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
        this.socketService.disconnect();
        this.localStorageService.clearUserSettings();
    }

    getProfile() {
        const profile = this.oAuthService.getIdentityClaims();
        return profile;
    }

    getToken() {
        return this.oAuthService.getAccessToken();
    }

    pingServer() {
        this.http.get(`${environment.socketUrl}`).subscribe();
    }

    private sendProfileToBackend(user: any) {
        const payload = {
            firstName: user.given_name,
            lastName: user.family_name,
            email: user.email,
            picture: user.picture,
            googleId: user.sub,
        };

        this.http.post<AuthDataGoogle>(`${environment.apiUrl}/auth/google/callback`, payload)
            .subscribe({
                next: (response: AuthDataGoogle) => {
                    this.localStorageService.setUserSettings(response);
                    this.socketService.connect(response.accessToken);
                    this.toastService.showToaster(
                        TOAST_STATE.success,
                        `Hi <strong>${user.given_name}</strong> <br> You have successfully logged in! `
                    );
                },
                error: (error) => {
                    this.toastService.showToaster(
                        TOAST_STATE.danger,
                        'Something went wrong, please try again'
                    );
                    console.log('sendProfileToBackend error', error);
                }
            });
    }
}