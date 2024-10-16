import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public isBrowser: boolean = typeof window !== 'undefined';
  private avatarSource = new BehaviorSubject<string>(this.isBrowser ? this.getCookie('avatar') || '' : '');
  avatar$ = this.avatarSource.asObservable();


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Método para actualizar el avatar y guardarlo en una cookie
  updateAvatar(avatarUrl: string): void {
    this.avatarSource.next(avatarUrl);
    if (this.isBrowser) {
      this.setCookie('avatar', avatarUrl, 7);  // Solo establecer cookie si estamos en el navegador
    }
  }

  // Método para establecer una cookie (solo en el navegador)
  private setCookie(name: string, value: string, days: number): void {
    if (!this.isBrowser) return;

    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  // Método para obtener una cookie por su nombre (solo en el navegador)
  public getCookie(name: string): string | null {
    if (!this.isBrowser) return null;

    const nameEQ = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookiesArray = decodedCookie.split(';');

    for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = cookiesArray[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }

  // Método para borrar una cookie (solo en el navegador)
  private deleteCookie(name: string): void {
    if (this.isBrowser) {
      this.setCookie(name, '', -1);
    }
  }
}
