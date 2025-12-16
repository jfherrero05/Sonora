import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss'],
})
export class InicioSesionComponent {
  formularioLogin: FormGroup;

  // Inyecto FormBuilder para crear formularios, el servicio de Auth para conectar con la API,
  // y Router para navegar tras el login.
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Configuro el formulario definiendo los campos email y contraseña como obligatorios.
    // Además valido que el email tenga formato correcto y la contraseña al menos 6 caracteres.
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Este método se activa cuando el usuario pulsa el botón de 'Confirmar'.
  onSubmit() {
    if (this.formularioLogin.valid) {
      // Si el formulario está bien, envío los datos al servicio de autenticación.
      this.authService
        .login(this.formularioLogin.value)
        .subscribe((success) => {
          if (success) {
            // Si el login es correcto, mando al usuario a la página principal.
            this.router.navigate(['/']);
          } else {
            // Si falla (ej. contraseña mal), aviso al usuario.
            alert('Credenciales incorrectas. Inténtalo de nuevo.');
          }
        });
    } else {
      alert('Formulario inválido. Revisa los campos.');
    }
  }
}
