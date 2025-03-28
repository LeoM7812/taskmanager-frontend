import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';


type TokenResponse = {
  token: string;
};

export type RegisterRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'MANAGER';
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static getUserRole() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8080/api/auth';
  private apiUrlRole = 'http://localhost:8080/api/users';
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private router = inject(Router);
 

  login(email: string, password: string) {
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          this.storageService.setToken(response.token);
          this.storageService.setEmail(email);
          this.router.navigateByUrl('/');
        }),
        catchError((error) => {
          return throwError(
            () => new Error('Incorrect login, please try again.')
          );
        })
      )
  }
  getUserRole() {
    const token = this.storageService.getToken();
    if (!token) {
      return throwError(() => new Error('No token found.'));
    }

    return this.http.get<{
      tostring: string; role: string 
}>(`${this.apiUrlRole}/role`, {
      headers: {
      Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap((response) => {
      return response.role;
      }),
      catchError((error) => {
      return throwError(() => new Error('Failed to fetch user role.'));
      })
    );
  }
  register({firstname,lastname,email,password,role}:RegisterRequest) {
    return this.http.post<TokenResponse>(`${this.apiUrl}/register`, {
      firstname,
      lastname,
      email,
      password,
      role,
    }).pipe(
    tap(response => {
      this.storageService.setToken(response.token);
      this.router.navigate(['/']);
   }),
   catchError(error => {
     return throwError(() => new Error('Registration failed, please try again.'));
   })
  );
  }
  logout() {
    this.storageService.clearToken();
    this.storageService.clearRole();
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!this.storageService.getToken();
  }
}

