import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket {

  constructor() { 
    super({ url: 'http://localhost:4000', options: {} });
  }

  // Emitir un evento para crear o unirse a una sala
  joinRoom(room: string) {
    this.emit('joinRoom', room);
  }

  // Escuchar mensajes del servidor
  onNewMessage() {
    return this.fromEvent('message');
  }
}
