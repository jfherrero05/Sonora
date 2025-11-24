import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent {

  formularioLogin: FormGroup;

  constructor(private fb: FormBuilder) {
    // Creamos el formulario con validaciones
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Esto se ejecuta al pulsar el botón
  onSubmit() {
    if (this.formularioLogin.valid) {
      console.log('Datos listos para enviar:', this.formularioLogin.value);
      alert('¡Formulario válido! Revisa la consola (F12) para ver los datos.');
    } else {
      alert('Formulario inválido. Revisa los campos.');
    }
  }
}