import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (!storageService.getRole()) {
    try {
      await storageService.getAndSetRole();
    } catch (error) {
      console.error('Erro ao obter role:', error);
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
