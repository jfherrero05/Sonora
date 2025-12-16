// Defino la estructura de datos que tendrá un usuario en mi aplicación.
export interface User {
  nombre: string;
  apellidos: string;
  email: string;
  // La contraseña es opcional aquí porque a veces manejo datos de usuario sin incluir su clave (por seguridad).
  password?: string;
  pais: string;
}
