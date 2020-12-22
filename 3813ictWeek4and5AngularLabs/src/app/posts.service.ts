import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  // create observble data to subscribe
  userStatus$: Observable<any>;
  private statusSubject = new Subject<any>();

  constructor(private http:HttpClient) {
    this.userStatus$ = this.statusSubject.asObservable();
  }

  getUser(){
    return this.http.get('http://localhost:3000/api/auth');
  }

  // add data to the observable data
  isValid(valid:boolean){
    this.statusSubject.next(valid);
  }
  
}
