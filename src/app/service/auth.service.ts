import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
// AÑADIDO: Importar HttpClient y operadores para manejar la respuesta
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
// Asumo que la interfaz User existe, si no, usa una nueva o 'any'
import { User } from '../interfaces/user.interface'; 


// -------------------------------------------------------------
// INTERFACES (Definiciones para tipos de datos)
// -------------------------------------------------------------
// Interfaz para la respuesta de LOGIN/REGISTRO del Backend
interface AuthResponse {
  mensaje: string;
  token: string;
  id_usuario?: number; // Opcional, dependiendo de si lo devuelves en ambas
  nombre_usuario: string; 
  es_administrador?: number; // Solo si lo usas en el registro
}

// Interfaz para los datos que enviamos al Backend
interface Credentials {
  email: string;
  password: string;
  nombre_usuario?: string; // Solo para registro
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // CLAVE PARA EL LOCALSTORAGE
  private TOKEN_KEY = 'jwt_token';
  
  // URL base de tu backend Node.js (¡IMPORTANTE!)
  private baseUrl = 'http://localhost:3000/api/usuarios';

  // Mantenemos BehaviorSubject para el estado de Angular
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private currentUserSubject = new BehaviorSubject<any>(
    this.getUserFromStorage()
  );

  // AÑADIDO: Inyectar HttpClient
  constructor(private http: HttpClient) {}

  // Observable para el estado de autenticación
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
  
  // -------------------------------------------------------------
  // FUNCIÓN DE LOGIN (Ahora conectada a la BBDD)
  // -------------------------------------------------------------
  login(credentials: Credentials): Observable<AuthResponse> {
    const url = `${this.baseUrl}/login`;

    // 1. Petición POST al backend
    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap(response => {
        // 2. Si es exitoso (código 200), guardamos el token y la sesión
        if (response.token) {
          this.setSession(response.token, response.nombre_usuario, response.id_usuario);
        }
      })
      // NOTA: Si el login falla (ej. 401), el 'error' se maneja en el .subscribe() del componente.
    );
  }

  // -------------------------------------------------------------
  // FUNCIÓN DE REGISTRO (Ahora conectada a la BBDD)
  // -------------------------------------------------------------
  register(userData: Credentials): Observable<AuthResponse> {
    const url = `${this.baseUrl}/registro`;

    // 1. Petición POST al backend
    return this.http.post<AuthResponse>(url, userData).pipe(
      tap(response => {
        // 2. Si es exitoso (código 201), guardamos el token y la sesión (auto-login)
        if (response.token) {
          this.setSession(response.token, response.nombre_usuario, response.id_usuario);
        }
      })
    );
  }

  // -------------------------------------------------------------
  // FUNCIÓN DE LOGOUT
  // -------------------------------------------------------------
  logout() {
    localStorage.removeItem(this.TOKEN_KEY); // Borra el token
    localStorage.removeItem('sonora_current_user'); 
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
  }

  // -------------------------------------------------------------
  // FUNCIÓN PARA ESTABLECER LA SESIÓN
  // -------------------------------------------------------------
  private setSession(token: string, nombre_usuario: string, id_usuario: number | undefined) {
    // 1. Guardar el Token JWT
    localStorage.setItem(this.TOKEN_KEY, token); 
    
    // 2. Guardar datos básicos del usuario (opcional, pero útil)
    const userPayload = {
        id_usuario: id_usuario, 
        nombre_usuario: nombre_usuario 
    };
    localStorage.setItem('sonora_current_user', JSON.stringify(userPayload));
    
    // 3. Notificar a Angular del cambio de estado
    this.loggedIn.next(true);
    this.currentUserSubject.next(userPayload);
  }
  
  // -------------------------------------------------------------
  // FUNCIONES DE COMPROBACIÓN (Actualizadas para usar el Token)
  // -------------------------------------------------------------

  getToken(): string | null {
      return localStorage.getItem(this.TOKEN_KEY);
  }

  private checkLoginStatus(): boolean {
    // Comprueba si existe un token JWT válido
    const token = this.getToken();
    return !!token; // Si hay token, se considera logueado (simplificado)
  }

  private getUserFromStorage(): any {
    const user = localStorage.getItem('sonora_current_user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }
}