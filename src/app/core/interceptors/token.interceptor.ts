import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { apiKey } from '../../../environments/environment';
import { ELocalStorage } from '../../types.ts/enum';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private apiKey: string = apiKey;
  constructor() {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string | null = localStorage.getItem(ELocalStorage.token);

    if (token) {
      let body;
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body);
      } else {
        body = req.body;
      }

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    return next.handle(req);
  }
}