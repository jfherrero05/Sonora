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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Creamos el formulario con validaciones
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Esto se ejecuta al pulsar el botón
  onSubmit() {
    if (this.formularioLogin.valid) {
      this.authService
        .login(this.formularioLogin.value)
        .subscribe((success) => {
          if (success) {
            this.router.navigate(['/']); // Redirigir a Inicio
          } else {
            alert('Credenciales incorrectas. Inténtalo de nuevo.');
          }
        });
    } else {
      alert('Formulario inválido. Revisa los campos.');
    }
  }
}
