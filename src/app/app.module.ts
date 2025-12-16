import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Importo el módulo de formularios reactivos para manejar los formularios de login, registro y subida.
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { SubidaArchivosComponent } from './subida-archivos/subida-archivos.component';
import { RegistroSesionComponent } from './registro-sesion/registro-sesion.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    // Aquí declaro todos los componentes que forman parte de este módulo principal.
    AppComponent,
    InicioSesionComponent,
    SubidaArchivosComponent,
    RegistroSesionComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Importo los módulos necesarios para que funcionen los formularios y las peticiones HTTP en toda la app.
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
