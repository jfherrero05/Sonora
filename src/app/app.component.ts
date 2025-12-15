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

    // Escuchar cambios de ruta para ocultar botones en registro/login/subida
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Solo mostrar en la raíz '/'
        this.isHomePage = event.urlAfterRedirects === '/';
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Recargar o asegurar estar en home
  }
}
