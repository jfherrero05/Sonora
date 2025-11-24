import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-sesion',
  templateUrl: './registro-sesion.component.html',
  styleUrls: ['./registro-sesion.component.scss']
})
export class RegistroSesionComponent {

  formularioRegistro: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required], // <--- NUEVO
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      pais: ['', Validators.required],      // <--- NUEVO
      ciudad: ['', Validators.required]     // <--- Para el input vacío que tenías
    });
  }

  onSubmit() {
    if (this.formularioRegistro.valid) {
      // Validar que las contraseñas coinciden
      const pass = this.formularioRegistro.get('password')?.value;
      const confirm = this.formularioRegistro.get('confirmPassword')?.value;

      if (pass !== confirm) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      console.log('Datos Registro:', this.formularioRegistro.value);
      alert('¡Registro completado!');
    } else {
      alert('Por favor, rellena todos los campos.');
    }
  }
}