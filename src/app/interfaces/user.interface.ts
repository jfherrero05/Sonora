export interface User {
  nombre: string;
  apellidos: string;
  email: string;
  password?: string; // Optional for when we just want profile info safe? Or explicit
  pais: string;
  // ciudad removed
}

// Simple interface for now.
