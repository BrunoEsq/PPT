import { ApplicationRef, inject, Injectable } from '@angular/core';
import { first, Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private isConnected = new BehaviorSubject<boolean>(false);

  constructor() {
    this.socket = io('http://localhost:3000', { autoConnect: false });
    inject(ApplicationRef).isStable.pipe(
      first((isStable) => isStable))
    .subscribe(() => { 
      this.socket.connect();
      this.socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        this.isConnected.next(true);
      });
    });
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        console.log(`Received event: ${eventName}`, data);
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    console.log(`Emitting event: ${eventName}`, data);
    this.socket.emit(eventName, data);
  }

  getConnectionStatus(): Observable<boolean> {
    return this.isConnected.asObservable();
  }
}
