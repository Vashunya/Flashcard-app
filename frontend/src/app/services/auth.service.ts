import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login/`, { username, password }).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(username: string, password: string, email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register/`, { username, password, email }).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout(): void {
    this.http.post(`${this.api}/logout/`, {}).subscribe();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', res.username);
  }

  getToken(): string | null  { return localStorage.getItem('token'); }
  getUsername(): string | null { return localStorage.getItem('username'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
}