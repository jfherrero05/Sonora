import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subida-archivos',
  templateUrl: './subida-archivos.component.html',
  styleUrls: ['./subida-archivos.component.scss']
})
export class SubidaArchivosComponent {

  formularioSubida: FormGroup;
  archivoSeleccionado: File | null = null;
  nombreArchivo: string = 'Introduzca el archivo mp3'; // Para cambiar el texto del label
  porcentaje: number = 0; // Para la barra de progreso
  subiendo: boolean = false; // Para mostrar/ocultar la barra

  constructor(private fb: FormBuilder) {
    this.formularioSubida = this.fb.group({
      titulo: ['', Validators.required],
      categoria: ['', Validators.required],
      autor: ['', Validators.required],      // Nuevo campo
      descripcion: ['', Validators.required],
      notas: ['']                            // Para el textarea
    });
  }

  // Detectar el archivo
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      this.nombreArchivo = file.name; // Cambiamos el texto del botón por el nombre del archivo
    }
  }

  onSubmit() {
    if (this.formularioSubida.valid && this.archivoSeleccionado) {
      
      // SIMULACIÓN DE SUBIDA (Animación de la barra)
      this.subiendo = true;
      const intervalo = setInterval(() => {
        this.porcentaje += 10;
        if (this.porcentaje >= 100) {
          clearInterval(intervalo);
          alert('¡Archivo subido con éxito!');
          this.subiendo = false;
          this.porcentaje = 0;
          this.formularioSubida.reset();
          this.nombreArchivo = 'Introduzca el archivo mp3';
        }
      }, 200); // Sube un 10% cada 0.2 segundos

    } else {
      alert('Por favor, completa todos los campos y elige un archivo.');
    }
  }
}