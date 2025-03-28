import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  return authService.getUserRole().pipe(
    map(role => {
      console.log(role);
      const rolecompare: string = role as unknown as string;
      
      if (rolecompare !== 'MANAGER') {
        return false;
      } else {
        return true;
      }
    })
  );
}
