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
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.formularioLogin.valid) {
      // Llamamos al servicio pasando { email, password }
      this.authService.login(this.formularioLogin.value).subscribe({
        next: (res) => {
          console.log('Login exitoso:', res);
          this.router.navigate(['/']); // Redirigir a Inicio
        },
        error: (err) => {
          // Si el servidor devuelve 401 (Unauthorized), caerá aquí
          console.error('Error en el login:', err);
          
          if (err.status === 401) {
            alert('Credenciales incorrectas.');
          } else {
            alert('Error de conexión con el servidor.');
          }
        }
      });
    } else {
      alert('Formulario inválido.');
    }
  }
}