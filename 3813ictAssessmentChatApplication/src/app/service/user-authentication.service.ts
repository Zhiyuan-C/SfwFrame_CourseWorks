import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

const BACKEND_URL = 'http://localhost:3000'; // back-end url path, do not change
// http options
const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationService {

  // observe current data status
  userStatus$: Observable<any>;
  private statusSubject = new Subject<any>();

  constructor(private httpClient: HttpClient) {
    // make status obserable
    this.userStatus$ = this.statusSubject.asObservable();
  }

  /**
   * add data to the observable data
   * @param valid user data
   */
  isValid(valid: object) {
    this.statusSubject.next(valid);
  }

  /**
   * login or get user detai;, return user detail data as obserable.
   * @param user username and password
   * @returns user data for subscribe
   */
  login(user) {
    return this.httpClient.post(BACKEND_URL + '/login', user, HTTP_OPTIONS);
  }
}
