import type { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthGoogleService } from '../auth/serice/auth-google.service';



export const httpErrorsInterceptor: HttpInterceptorFn = (req, next) => {

  // const authService = inject(AuthGoogleService);


  const localeStorage = localStorage?.getItem('auth');
  const accessToken = localeStorage ? JSON.parse(localeStorage)?.userSettings?.accessToken : null;

  let modifiedRequest: HttpRequest<any>;  // eslint-disable-line @typescript-eslint/no-explicit-any

  //we need to remove header of authorization, due correctly work OAuth2
  if (accessToken) {
    modifiedRequest = req.clone({
      setHeaders: {
        Authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    })
  } else {
    modifiedRequest = req.clone();
  }
  return next(modifiedRequest).pipe(
    catchError((dataError: HttpErrorResponse) => {
      const error = dataError.error;
      console.log('error', error);
      switch (error.status) {
        case 401:
          localStorage.clear();
          console.log(`Ваша сесія застаріла. Увійдіть знову, код помилки: ${error.status}`);
          console.warn('!!!Redirect to the login page after!!!');
          // authService.logout();
          break;
        case 500: console.log('Виникла помилка на сервері', error.status);
          break;
        case 505:
          console.log(`На данний момент сервер не доступний., код помилки: ${error.status}`);
          break;
        case 524:
          console.log('Виникла помилка, будь ласка зверністься до технічної підтримки', error.status);
          break;
        case 404:
          console.log('Запитуваний ресурс недоступний', error.status);
          break;
        default:
          console.log('Неочікувана помилка', error.status);
          break;
      }
      return throwError(() => error);
    })
  )


};



