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
  
  constructor(private profileService: ProfileService) {

  }
}
