import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importo los componentes que voy a mostrar en cada una de las páginas.
import { HomeComponent } from './home/home.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { RegistroSesionComponent } from './registro-sesion/registro-sesion.component';
import { SubidaArchivosComponent } from './subida-archivos/subida-archivos.component';
import { CategoryComponent } from './category/category.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Configuro la ruta raíz para que muestre el Home.
  { path: 'login', component: InicioSesionComponent },
  { path: 'registro', component: RegistroSesionComponent },
  { path: 'subir', component: SubidaArchivosComponent },
  { path: 'categoria/:nombre', component: CategoryComponent },
  { path: 'buscar/:termino', component: SearchComponent },
  { path: '**', redirectTo: '' }, // Si el usuario escribe una ruta que no existe, lo redirijo al inicio.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
