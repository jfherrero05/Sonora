import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-registro-sesion',
  templateUrl: './registro-sesion.component.html',
  styleUrls: ['./registro-sesion.component.scss'],
})
export class RegistroSesionComponent {
  formularioRegistro: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Configuro el formulario de registro con todos los campos necesarios.
    // Valido que las contraseñas tengan longitud mínima y que el email sea correcto.
    this.formularioRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      pais: ['', Validators.required],
    });
  }

  // Método que gestiona el envío del formulario de registro.
  onSubmit() {
    if (this.formularioRegistro.valid) {
      const pass = this.formularioRegistro.get('password')?.value;
      const confirm = this.formularioRegistro.get('confirmPassword')?.value;

      // Una comprobación extra de seguridad para asegurar que el usuario no se equivocó al escribir la clave.
      if (pass !== confirm) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      // Si todo es correcto, envío los datos de registro al servicio.
      this.authService
        .register(this.formularioRegistro.value)
        .subscribe((success) => {
          if (success) {
            alert('¡Registro completado! Bienvenido.');
            // Si el registro funciona, el servicio de auth ya habrá hecho autologin, así que voy al home.
            this.router.navigate(['/']);
          } else {
            alert(
              'Error al registrar. El usuario ya existe o hubo un problema.'
            );
          }
        });
    } else {
      alert('Por favor, rellena todos los campos obligatorios.');
    }
  }
}
