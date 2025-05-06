import type { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject, Injector } from '@angular/core';
import { AuthGoogleService } from '../auth/serice/auth-google.service';
import { LocalStorageUserService } from '../shared/services/local-storage-user.service';
import { TOAST_STATE, ToastService } from '../shared/services/toast.service';



export const httpErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const localStorageService = injector.get(LocalStorageUserService);
  const toastService = injector.get(ToastService);

  const userSettings = localStorageService.userSettings();
  const accessToken = userSettings?.accessToken;

  const urlWithoutHeader = 'https://accounts.google.com/.well-known/openid-configuration'

  let modifiedRequest: HttpRequest<any> = req;


  if (accessToken && req.url !== urlWithoutHeader) {
    modifiedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(modifiedRequest).pipe(
    catchError((dataError: HttpErrorResponse) => {
      const error = dataError.error;
      console.log('error httpErrorsInterceptor', dataError);

      const authService = injector.get(AuthGoogleService);
      switch (dataError.status) {
        case 401:
          authService.logout();
          toastService.showToaster(
            TOAST_STATE.danger,
            `Your session has expired. Please log in again. ${dataError.status}`
          );
          break;
        case 500:
          toastService.showToaster(
            TOAST_STATE.danger,
            `Internal server error. ${dataError.status}`
          );
          break;
        case 505:
          console.log(`Server not available. ${dataError.status}`);
          break;
        case 524:
          console.log('Please call the administrator', dataError.status);
          break;
        case 404:
          console.log('Resource not found', dataError.status);
          break;
        default:
          toastService.showToaster(
            TOAST_STATE.danger,
            `${dataError.statusText}please login again. ${dataError.status}`
          );
          authService.logout();
          break;
      }

      return throwError(() => error);
    })
  );
};




