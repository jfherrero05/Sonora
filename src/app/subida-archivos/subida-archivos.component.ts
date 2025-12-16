import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-subida-archivos',
  templateUrl: './subida-archivos.component.html',
  styleUrls: ['./subida-archivos.component.scss']
})
export class SubidaArchivosComponent {

  formularioSubida: FormGroup;
  archivoSeleccionado: File | null = null;
  nombreArchivo: string = 'Introduzca el archivo mp3';
  porcentaje: number = 0;
  subiendo: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient
  ) {
    this.formularioSubida = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required], 
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      notas: ['']
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type !== 'audio/mpeg' && !file.name.endsWith('.mp3')) {
        alert('Por favor, selecciona un archivo MP3 válido.');
        return;
      }
      this.archivoSeleccionado = file;
      this.nombreArchivo = file.name;
    }
  }

  onSubmit() {
    if (this.formularioSubida.valid && this.archivoSeleccionado) {
      this.subiendo = true;
      this.porcentaje = 0;

      const formData = new FormData();
      formData.append('archivo', this.archivoSeleccionado);
      formData.append('titulo', this.formularioSubida.get('titulo')?.value);
      formData.append('autor', this.formularioSubida.get('autor')?.value);
      
      // --- CORRECCIÓN AQUÍ ---
      // 1. Obtenemos el string del objeto que vimos en tu captura de pantalla
      const currentUserJson = localStorage.getItem('sonora_current_user'); 

      if (currentUserJson) {
        try {
          // 2. Convertimos el string a un objeto JavaScript real
          const userObj = JSON.parse(currentUserJson);
          
          // 3. Extraemos el id_usuario (que es el 3 en tu imagen)
          const idUsuario = userObj.id_usuario;
          
          formData.append('id_usuario_fk', idUsuario.toString());
          console.log('ID de usuario detectado y enviado:', idUsuario);
        } catch (e) {
          console.error('Error al leer los datos de usuario:', e);
          alert('Error en los datos de sesión.');
          this.subiendo = false;
          return;
        }
      } else {
        alert('No se ha encontrado sesión de usuario. Inicia sesión de nuevo.');
        this.subiendo = false;
        return;
      }
      // -------------------------

      this.http.post('http://localhost:3000/api/archivos/subir', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.porcentaje = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            alert('¡Canción subida y registrada con éxito!');
            this.finalizarSubida();
          }
        },
        error: (err) => {
          console.error('Error en la subida:', err);
          alert('Error al subir el archivo. Revisa si el servidor está encendido.');
          this.subiendo = false;
        }
      });

    } else {
      alert('Por favor, completa los campos obligatorios y selecciona un archivo MP3.');
    }
  }

  private finalizarSubida() {
    this.subiendo = false;
    this.porcentaje = 0;
    this.formularioSubida.reset();
    this.nombreArchivo = 'Introduzca el archivo mp3';
    this.archivoSeleccionado = null;
  }
}