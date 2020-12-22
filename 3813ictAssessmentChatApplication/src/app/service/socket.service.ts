import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
const BACKEND_URL = 'http://localhost:3000'; // back-end url path, do not change

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  constructor() { }

  // connect to socket
  socketInit(): void {
    this.socket = io(BACKEND_URL);
  }
  // emit message
  emitMsg(message): void {
    this.socket.emit('message', message);
  }
  // close connection
  closeSocket(): void {
    console.log('called');
    this.socket.emit('manualDisconnect');
  }
  // send current channel detail, to work with database
  sendChannelDetail(detail): void {
    this.socket.emit('channelData', detail);
  }
  // message observer
  messageObserver(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('message', (msg: string) => observer.next(msg));
    });
    return observable;
  }
  // announcementObserver observer
  announcementObserver(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('announcement', (msg: string) => observer.next(msg));
    });
    return observable;
  }
  // historyObserver observer
  historyObserver(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('chatHistory', (msg: string) => observer.next(msg));
    });
    return observable;
  }
}
