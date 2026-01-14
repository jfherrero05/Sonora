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
    });
  }

  // Método que gestiona el envío del formulario de registro.
  onSubmit() {
    if (this.formularioRegistro.valid) {
      const pass = this.formularioRegistro.get('password')?.value;
      const confirm = this.formularioRegistro.get('confirmPassword')?.value;

      if (pass !== confirm) {
        alert('Las contraseñas no coinciden.');
        return;
      }
// Datos al formato del Backend{ nombre_usuario, email, password }
      const datosParaBackend = {
        nombre_usuario: `${this.formularioRegistro.value.nombre} ${this.formularioRegistro.value.apellidos}`,
        email: this.formularioRegistro.value.email,
        password: this.formularioRegistro.value.password
      };

      // Envío de la petición a través del servicio
      this.authService
        .register(datosParaBackend)
        .subscribe({
          next: (response) => {
            // Este bloque se ejecuta si el servidor responde 200 o 201 OK
            console.log('Registro exitoso:', response);
            alert('¡Registro completado! Bienvenido.');
            this.router.navigate(['/']); // Redirigir al inicio o home
          },
          error: (err) => {
            // Este bloque captura errores como el 400 (Bad Request) o 500
            console.error('Error detallado del servidor:', err);
            
            // Intentamos mostrar el mensaje de error que viene del backend
            const mensajeError = err.error?.mensaje || 'Error al registrar. Inténtalo de nuevo.';
            alert(mensajeError);
          }
        });
    } else {
      alert('Por favor, rellena todos los campos obligatorios correctamente.');
    }
  }
}