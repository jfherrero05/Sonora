import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Sonora';
  isLoggedIn$: Observable<boolean>;
  isHomePage: boolean = true;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;

    // Me suscribo a los eventos del router para saber en qué página estoy.
    // Esto me permite ocultar o mostrar ciertos botones si estoy en la página de inicio o no.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Verifico si la URL actual tras las redirecciones es la raíz '/'.
        this.isHomePage = event.urlAfterRedirects === '/';
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Al cerrar sesión, redirijo al usuario al inicio por seguridad.
  }
}
