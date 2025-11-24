import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// 1. IMPORTAMOS EL MÓDULO DE FORMULARIOS AQUÍ
import { ReactiveFormsModule } from '@angular/forms'; // <--- AÑADE ESTO

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { SubidaArchivosComponent } from './subida-archivos/subida-archivos.component';
import { RegistroSesionComponent } from './registro-sesion/registro-sesion.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    SubidaArchivosComponent,
    RegistroSesionComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // 2. Y LO REGISTRAMOS AQUÍ ABAJO
    ReactiveFormsModule // <--- AÑADE ESTO
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }