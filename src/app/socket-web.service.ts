import { ApplicationRef, inject, Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketWebService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', { autoConnect: false });
    inject(ApplicationRef).isStable.pipe(
      first((isStable) => isStable))
    .subscribe(() => { this.socket.connect() });
  }

  // Unirse o crear una sala
  joinRoom(room: string) {
    this.socket.emit('joinRoom', room); // Emitir al servidor el evento para unirse a la sala
  }

  // Escuchar mensajes
  onMessage(callback: (message: string) => void) {
    this.socket.on('message', callback);
  }

  // Enviar un mensaje a la sala
  sendMessage(room: string, message: string) {
    this.socket.emit('sendMessage', { room, message });
  }
}
