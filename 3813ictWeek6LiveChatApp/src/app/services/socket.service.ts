import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor() { }

  // connect to socket
  public socketInit(): void {
    this.socket = io(SERVER_URL);
  }
  // emit message
  public emitMsg(message: string): void {
    this.socket.emit('message', message);
  }
  // message observer
  public onMsg(): Observable<any> {
    let observable = new Observable(observer => {
      this.socket.on('message', (msg:string) => observer.next(msg));
    });
    return observable;
  }
}
