import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from './services/storage.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const token = storageService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 403) {
        storageService.clearToken();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
