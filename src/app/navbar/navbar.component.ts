import { Component } from '@angular/core';
import { ProfileService } from '../profile.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  avatar = '';
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.avatar$.subscribe((avatar: string) => {
      console.log(this.profileService);
      this.avatar = avatar;

      if (this.avatar === '') {
        this.avatar = "https://api.multiavatar.com/Paco.svg";
      }
    });
  }
}
