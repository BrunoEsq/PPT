import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../profile.service';


@Component({
  selector: 'app-create-match',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-match.component.html',
  styleUrl: './create-match.component.css'
})
export class CreateMatchComponent {

  floating_email = "";
  floating_password = "";

  room = "";
  avatar = "";
  random = -1;
  image = "https://cdn-icons-png.flaticon.com/512/6831/6831874.png";

  constructor(private profileService: ProfileService) {

  }
  ngOnInit() {
    this.avatar = this.profileService.getCookie('avatar') ?? '';

    if (this.avatar) { // Verifica que this.avatar no esté vacío o undefined
      this.avatar = this.avatar.split("/")[3];
      this.avatar = this.avatar.split(".")[0];
    } else {
      console.warn("La cookie 'avatar' no está definida."); // Mensaje de advertencia
      this.avatar = ''; // O asigna un valor predeterminado
    }
  }

  createRoom() {
    this.profileService.setCookie("room", this.floating_email, 7);
    this.room = this.floating_email;
    console.log(this.room);
  }

 randomInt(min: number, max: number): number {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    return Math.floor(randomBuffer[0] / (0xFFFFFFFF + 1) * (max - min)) + min;
}

// Tu método ppt
ppt(codigo: number) {
    // Genera un número aleatorio entre 0 y 2
    this.random = this.randomInt(0, 3); // Cambia randomInt(3) a randomInt(0, 3)
    
    // Verifica las condiciones de victoria
    if (codigo === this.random) {
        console.log('Empate');
        this.image = "https://e7.pngegg.com/pngimages/347/831/png-clipart-aktobe-text-typesetting-typesetter-service-playing-the-fat-of-the-tie-love-child-thumbnail.png";
        
    } else if (codigo === 0 && this.random === 1) {
        console.log('Pierdes: Piedra vs Papel');
        this.image = "https://png.pngtree.com/png-vector/20210716/ourmid/pngtree-lose-popup-loser-dialog-defeat-failure-fail-png-image_3605553.jpg";
    } else if (codigo === 0 && this.random === 2) {
        console.log('Ganas: Piedra vs Tijera');
        this.image = "https://img.freepik.com/premium-vector/winner-banner-modern-curved-ads-tag_189959-1310.jpg";
    } else if (codigo === 1 && this.random === 0) {
        console.log('Ganas: Papel vs Piedra');
        this.image = "https://img.freepik.com/premium-vector/winner-banner-modern-curved-ads-tag_189959-1310.jpg";
    } else if (codigo === 1 && this.random === 2) {
        console.log('Pierdes: Papel vs Tijera');
        this.image = "https://png.pngtree.com/png-vector/20210716/ourmid/pngtree-lose-popup-loser-dialog-defeat-failure-fail-png-image_3605553.jpg";
    } else if (codigo === 2 && this.random === 0) {
        console.log('Pierdes: Tijera vs Piedra');
        this.image = "https://png.pngtree.com/png-vector/20210716/ourmid/pngtree-lose-popup-loser-dialog-defeat-failure-fail-png-image_3605553.jpg";
    } else if (codigo === 2 && this.random === 1) {
        console.log('Ganas: Tijera vs Papel');
        this.image = "https://img.freepik.com/premium-vector/winner-banner-modern-curved-ads-tag_189959-1310.jpg";
    }
}

}
