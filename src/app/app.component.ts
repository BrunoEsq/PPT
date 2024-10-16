import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // Sólo RouterOutlet aquí
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';  // Asegúrate de importar Navbar
import { LobbyComponent } from './lobby/lobby.component';
import { CreateMatchComponent } from './create-match/create-match.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,  // Importamos los componentes necesarios
    RouterOutlet,    // Esto es necesario para el enrutamiento
    LobbyComponent, 
    CreateMatchComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PPT';
}
