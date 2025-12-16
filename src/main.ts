import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Inicio el módulo principal de la aplicación (AppModule) para arrancar Angular en el navegador.
// Si ocurre algún error durante el arranque, lo muestro en la consola.
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
