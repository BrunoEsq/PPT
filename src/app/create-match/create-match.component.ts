import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { SocketService } from '../socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-match',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-match.component.html',
  styleUrl: './create-match.component.css'
})
export class CreateMatchComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  message: string = '';
  floating_email = "";
  room = "";
  avatar = "";
  image = "https://cdn-icons-png.flaticon.com/512/6831/6831874.png";
  playerChoice = -1; // La elección del jugador actual
  opponentChoice = -1; // La elección del oponente
  resultMessage = "";  // Mensaje de resultado

  private messageSubscription!: Subscription;
  private gameSubscription!: Subscription;

  constructor(
    private profileService: ProfileService, 
    private socketWeb: SocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.avatar = this.profileService.getCookie('avatar') ?? '';
    
    if (this.avatar) { 
      this.avatar = this.avatar.split("/")[3];
      this.avatar = this.avatar.split(".")[0];
    } else {
      console.warn("La cookie 'avatar' no está definida.");
      this.avatar = '';
    }

    // Escuchar mensajes del servidor
    this.messageSubscription = this.socketWeb.listen('message').subscribe((data: string) => {
      this.messages.push(data);
      this.cdr.detectChanges();
    });

    // Escuchar el resultado del juego
    this.gameSubscription = this.socketWeb.listen('gameResult').subscribe((data: any) => {
      console.log('Game result received', data);
      this.playerChoice = data.playerChoice;
      this.opponentChoice = data.opponentChoice;
      this.updateGameResult();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  createRoom() {
    this.room = this.floating_email;
    console.log(this.room);
    this.socketWeb.emit('joinRoom', { room: this.room, avatar: this.avatar });
  }

  sendMessage() {
    if (this.message) {
      this.socketWeb.emit('message', this.message);
      this.message = '';
    }
  }

  // El jugador hace su elección
  ppt(codigo: number) {
    console.log('Player choice:', codigo);
    this.playerChoice = codigo;
    this.socketWeb.emit('playGame', { room: this.room, choice: codigo });
  }

  // Actualizar el resultado del juego
  updateGameResult() {
    if (this.playerChoice === this.opponentChoice) {
      this.resultMessage = 'Empate';
    } else if (
      (this.playerChoice === 0 && this.opponentChoice === 2) || // Piedra vence a tijera
      (this.playerChoice === 1 && this.opponentChoice === 0) || // Papel vence a piedra
      (this.playerChoice === 2 && this.opponentChoice === 1)    // Tijera vence a papel
    ) {
      this.resultMessage = 'Perdiste';
      this.image = "https://static.vecteezy.com/system/resources/thumbnails/016/775/740/small_2x/red-cross-isolated-png.png";
    } else {
      this.resultMessage = '¡Ganaste!';
      this.image = this.profileService.getCookie('avatar') ?? '';
    }
  }
  
}
