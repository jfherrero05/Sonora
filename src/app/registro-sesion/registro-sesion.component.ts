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
    this.formularioRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      pais: ['', Validators.required],
      // ciudad eliminado según solicitud
    });
  }

  onSubmit() {
    if (this.formularioRegistro.valid) {
      const pass = this.formularioRegistro.get('password')?.value;
      const confirm = this.formularioRegistro.get('confirmPassword')?.value;

      if (pass !== confirm) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      this.authService
        .register(this.formularioRegistro.value)
        .subscribe((success) => {
          if (success) {
            alert('¡Registro completado! Bienvenido.');
            this.router.navigate(['/']); // Ir a Inicio
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
