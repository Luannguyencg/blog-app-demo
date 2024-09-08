import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) {}

  postIntervalAPI(_url: string, _action: string, _body: any) {
    return this._http
      .post(_url + _action, JSON.stringify(_body), this.addHeader())
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this._errorIntervalHandler(error);
        })
      );
  }

  _errorIntervalHandler(error: any) {
    let errorMessage;
    if (!error || !error.status) {
      errorMessage = 'Server Not Responding';
    } else if (error.status === 401) {
      errorMessage = (error.error.message) || 'Bad Response';
    } else if (error.status === 500) {
      errorMessage = 'Server Error';
    } else {
      errorMessage = (error.error.message) || 'Bad Response';
    }
    return of(errorMessage);
  }

  _loginErrorHandler(error: any) {
    let errorMessage;
    if (!error || !error.status) {
      errorMessage = 'Server Not Responding';
    } else if (error.status === 401 || error.status === 400) {
      errorMessage = (error.error.message) || 'Invalid Username or Password';
    } else if (error.status === 500) {
      errorMessage = 'Server Error';
    } else {
      errorMessage = (error.error.message) || 'Bad Response';
    }

    return of(errorMessage);
  }

  getAPI(_url: string, _action: string, _body?: any) {
    const params = {} as any;
    if (_body) {
      for (const key in _body) {
        if (Array.isArray(_body[key])) {
          params[key] =  JSON.stringify(_body[key]);
        } else {
          params[key] = _body[key];
        }
      }
    }
    return this._http
      .get(_url + _action, { params: _body, headers: this.getHeader() })
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this._errorHandler(error);
        })
      );
  }

  postAPI(_url: string, _action: string, _body: any) {
    return this._http
      .post(_url + _action, JSON.stringify(_body), this.addHeader())
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this._errorHandler(error);
        })
      );
  }

  postFormAPI(_url: string, _action: string, _body: any) {
    return this._http
      .post(_url + _action, _body, this.addHeaderForMultipart())
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this._errorHandler(error);
        })
      );
  }

  putFormAPI(_url: string, _action: string, _body: any) {
    const urlString = _url + _action;
    return this._http
      .put(urlString, _body, this.addHeaderForMultipart())
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this._errorHandler(error);
        })
      );
  }

  putAPI(_url: string, _action: string, _body: any) {
    return this._http
      .put(_url + _action, JSON.stringify(_body), this.addHeader())
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this._errorHandler(error);
        })
      );
  }

  deleteAPI(_url: string, _action: string, _id?: string) {
    return this._http
      .delete(_url + _action, this.addHeader())
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this._errorHandler(error);
        })
      );
  }

  uploadImageAPI(
    _url: string,
    _action: string,
    _file: File,
    _propertyAgreementId?: string,
    _fileTypeId?: string,
    _name?: string,
  ) {
    const formData = new FormData();
    formData.append('file', _file);
    if (_propertyAgreementId != null) {
      formData.append('propertyAgreementId', _propertyAgreementId.toString());
    }
    if (_fileTypeId != null) {
      formData.append('fileTypeId', _fileTypeId.toString());
    }
    if (_name != null) {
      formData.append('fileName', _name.toString());
    }
    return this._http
      .post(_url + _action, formData, this.addHeaderForMultipart())
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this._errorHandler(error);
        })
      );
  }

  removeImageAPI(_url: string, _action: string, _index: number, _id: number, buttonId?: string) {
    const formData = new FormData();
    formData.append('index', _index.toString());
    formData.append('id', _id.toString());
    return this._http
      .post(_url + _action, formData, this.addHeaderForMultipart())
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          return this._errorHandler(error);
        })
      );
  }

  _errorHandler(error: any) {
    let errorMessage;
    if (!error || !error.status) {
      errorMessage = 'Server Not Responding';
    } else if (error.status === 401) {
      errorMessage = (error.error.message) || 'Bad Response';
    } else if (error.status === 500) {
      errorMessage = 'Server Error';
    } else {
      errorMessage = (error.error.message) || 'Bad Response';
    }

    return throwError(error);
  }

  private addHeader() {
    return { headers: this.getHeader() };
  }

  private getHeader() {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  private addHeaderForMultipart() {
    if (localStorage.getItem('token')) {
      const headers = new HttpHeaders();
      return { headers: headers };
    }
    return undefined;
  }
}