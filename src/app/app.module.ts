import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { AccesoSesionComponent } from './acceso-sesion/acceso-sesion.component';
import { SubidaArchivosComponent } from './subida-archivos/subida-archivos.component';
import { RegistroSesionComponent } from './registro-sesion/registro-sesion.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    AccesoSesionComponent,
    SubidaArchivosComponent,
    RegistroSesionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
