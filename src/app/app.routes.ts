import { Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { CreateMatchComponent } from './create-match/create-match.component';

// Definición de rutas
export const routes: Routes = [
  { path: 'lobby', component: LobbyComponent },
  { path: 'create-match', component: CreateMatchComponent },
  { path: '', redirectTo: '/lobby', pathMatch: 'full' },
];
