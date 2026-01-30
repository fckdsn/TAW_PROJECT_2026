import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/user';
  private isBrowser: boolean;
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /* ================= TOKEN ================= */

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  /* ================= USER ================= */

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.userId || null;
  }

  getLogin(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.login || null;
  }

  // ✅ ВАЖНО: getter для шаблонов Angular
  get login(): string | null {
    return this.getLogin();
  }

  /* ================= AUTH ================= */

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.jwtHelper.isTokenExpired(token);
  }

  authenticate(credentials: { login: string; password: string }): Observable<boolean> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/auth`, credentials)
      .pipe(
        map(res => {
          if (this.isBrowser && res?.token) {
            localStorage.setItem('token', res.token);
            return true;
          }
          return false;
        })
      );
  }

  createOrUpdate(data: { login: string; email: string; password: string; name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
  }
}
