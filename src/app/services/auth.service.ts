import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.sevice';
import { currentUser, login, register } from '../../environments/environment';
import {
  ApiUserResponse,
  ILoginPayload,
  ILoginRes,
  IUser,
} from '../types.ts/interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ELocalStorage } from '../types.ts/enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);
  private apiService = inject(ApiService);
  private router = inject(Router);

  private currentUser = new BehaviorSubject<IUser | null>(null);

  constructor() {
    if (this.getUserToken()) {
      this.isLoggedIn.update(() => true);
    }
  }

  get currentUser$() {
    return this.currentUser.asObservable();
  }

  get currentUserValue() {
    return this.currentUser.getValue();
  }

  setCurrentUser(value: IUser | null) {
    this.currentUser.next(value);
  }

  handlerRegister(payload: FormData) {
    return this.apiService.postFormAPI(register, '', payload);
  }

  handleLogin(payload: ILoginPayload): Observable<ILoginRes> {
    return this.apiService.postAPI(login, '', payload).pipe(
      tap((res) => {
        if (res && res.data && res.data.token) {
          localStorage.setItem(ELocalStorage.token, res.data.token);
          this.isLoggedIn.update(() => true);
        }
      }),
    );
  }

  handleLogOut() {
    localStorage.removeItem(ELocalStorage.token);
    this.isLoggedIn.update(() => false);
    this.setCurrentUser(null);
    this.router.navigate(['login']);
  }

  getUserToken() {
    return localStorage.getItem(ELocalStorage.token);
  }

  me(): Observable<ApiUserResponse> {
    return this.apiService.getAPI(currentUser, '').pipe(
      tap({
        next: (res) => {
          if (!res?.data) {
            this.handleLogOut();
          } else {
            this.setCurrentUser(res.data);
          }
        },
        error: (err) => {
          this.handleLogOut();
          console.log('error', err);
        },
      }),
    );
  }
}
