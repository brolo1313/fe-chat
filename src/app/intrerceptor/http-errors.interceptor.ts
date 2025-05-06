import type { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { computed, inject, Injector } from '@angular/core';
import { AuthGoogleService } from '../auth/serice/auth-google.service';
import { LocalStorageUserService } from '../shared/services/local-storage-user.service';



export const httpErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const localStorageService = injector.get(LocalStorageUserService);

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
          console.log(`Ваша сесія застаріла. Увійдіть знову, код помилки: ${dataError.status}`);
          break;
        case 500:
          console.log('Виникла помилка на сервері', dataError.status);
          break;
        case 505:
          console.log(`На даний момент сервер недоступний, код: ${dataError.status}`);
          break;
        case 524:
          console.log('Будь ласка, зверніться до підтримки', dataError.status);
          break;
        case 404:
          console.log('Ресурс не знайдено', dataError.status);
          break;
        default:
          console.log('Неочікувана помилка', error.status);
          authService.logout();
          break;
      }

      return throwError(() => error);
    })
  );
};




