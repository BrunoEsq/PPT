import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  name = "Choose your name";
  rank = "Beginner";
  n_choosed = false;
  avatarUrl = 'https://api.multiavatar.com/Paco.svg';
  loaded_cookies = false;
  temp_name = "";
  room: string = '';  // Aquí se define la propiedad 'room'

  constructor(private profileService: ProfileService) { }

  createProfile() {
    this.avatarUrl = `https://api.multiavatar.com/${this.name}.svg`;
    console.log(this.avatarUrl);
    this.profileService.updateAvatar(this.avatarUrl);
    this.n_choosed = true;
  }

  ngOnInit() {
    this.avatarUrl = this.profileService.getCookie('avatar') || 'https://api.multiavatar.com/Paco.svg';

    if (this.avatarUrl === 'https://api.multiavatar.com/Paco.svg') {
      this.n_choosed = false;
    } else {
      this.n_choosed = true;
      this.temp_name = this.avatarUrl.split('/')[3];
      this.name = this.temp_name.split('.')[0];
    }

    this.loaded_cookies = true;
  }

  // Método para unirse a una sala
  joinRoom(roomName: string) {
    this.room = roomName;  // Asignar el nombre de la sala seleccionada
    console.log(`Joined room: ${this.room}`);
    // Lógica adicional para unirse a la sala
  }
}
