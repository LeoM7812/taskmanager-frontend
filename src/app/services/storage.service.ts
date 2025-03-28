import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _cachedToken: string | null = null;
  private _cachedRole: string | null = null;
   private http = inject(HttpClient);
  private apiUrlRole = 'http://localhost:8080/api/users';
  private TOKEN_KEY = 'AUTH_TOKEN_KEY';
  private EMAILKEY = 'EMAIL';

  setToken(token: string) {
    if (!window) {
      return;
    }
    this._cachedToken = token;
    window.localStorage.setItem(this.TOKEN_KEY, token);
    this.getAndSetRole().catch((error) => {
      console.error('Failed to fetch and set role:', error);
    });
  }

  setEmail(email: string) {
    if (!window) {
      return;
    }
    window.localStorage.setItem(this.EMAILKEY, email);
  }

  async getAndSetRole(): Promise<void> {
    const token = this.getToken();
    if (!token) {
      console.error('No token found.');
      throw new Error('No token found.');
    }

    try {
      const response = await this.http.get<{ role: string }>(`${this.apiUrlRole}/role`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).toPromise();
      console.log(response);
      if (response as unknown as string) {
        this.setRole(response as unknown as string);
      } else {
        console.error('Role is null or undefined.');
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      throw error;
    }
  }
  clearRole() {
    if (!window) {
      return;
    }
    this._cachedRole = null;
    window.localStorage.removeItem('USER_ROLE');
  }

  private setRole(role: string) {
    this._cachedRole = role;
    window.localStorage.setItem('USER_ROLE', role);
  }

  getToken(): string | null | void {
    if (!window) {
      return;
    }
    if (!this._cachedToken) {
      this._cachedToken = window.localStorage.getItem(this.TOKEN_KEY);
    }
    return this._cachedToken;
  }
  getRole(): string | null {
    if (!this._cachedRole) {
      this._cachedRole = window.localStorage.getItem('USER_ROLE');
    }
    return this._cachedRole;
  }
  

  clearToken() {
    if (!window) {
      return;
    }
    this._cachedToken = null;
    window.localStorage.removeItem(this.TOKEN_KEY);
  }
}

