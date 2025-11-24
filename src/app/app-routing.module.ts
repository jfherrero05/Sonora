import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importamos los componentes
import { HomeComponent } from './home/home.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { RegistroSesionComponent } from './registro-sesion/registro-sesion.component';
import { SubidaArchivosComponent } from './subida-archivos/subida-archivos.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Al entrar, carga el Home
  { path: 'login', component: InicioSesionComponent },
  { path: 'registro', component: RegistroSesionComponent },
  { path: 'subir', component: SubidaArchivosComponent },
  { path: '**', redirectTo: '' } // Si la ruta está mal, vuelve al inicio
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }