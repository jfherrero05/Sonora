import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

// Defino las interfaces aquí mismo para tener claro qué datos recibo y envío en la autenticación.

// Esta interfaz estructura la respuesta que espero del servidor al hacer login o registro.
interface AuthResponse {
  mensaje: string;
  token: string;
  id_usuario?: number;
  nombre_usuario: string;
  es_administrador?: number;
}

// Utilizo esta interfaz para tipar los datos que envío al intentar iniciar sesión o registrarme.
interface Credentials {
  email: string;
  password: string;
  nombre_usuario?: string; // Este campo es opcional porque solo lo necesito en el registro.
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Defino la clave que usaré para guardar el token en el LocalStorage.
  private TOKEN_KEY = 'jwt_token';

  // Establezco la URL base de mi API para las operaciones de usuarios.
  private baseUrl = 'http://localhost:3000/api/usuarios';

  // Uso BehaviorSubject para mantener y emitir el estado actual de si el usuario está logueado o no.
  // Lo inicializo comprobando si ya existe un token válido.
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());

  // Este BehaviorSubject guarda los datos del usuario actual para acceder a ellos desde cualquier parte de la app.
  private currentUserSubject = new BehaviorSubject<any>(
    this.getUserFromStorage()
  );

  constructor(private http: HttpClient) {}

  // Expongo el estado de conexión como un Observable para que los componentes puedan suscribirse a los cambios.
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // De igual forma, expongo los datos del usuario actual.
  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  // Realizo la petición de login al servidor.
  login(credentials: Credentials): Observable<AuthResponse> {
    const url = `${this.baseUrl}/login`;

    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap((response) => {
        // Si el login es correcto y recibo un token, guardo la sesión inmediatamente.
        if (response.token) {
          this.setSession(
            response.token,
            response.nombre_usuario,
            response.id_usuario
          );
        }
      })
    );
  }

  // Gestiono el registro de nuevos usuarios.
  register(userData: Credentials): Observable<AuthResponse> {
    const url = `${this.baseUrl}/registro`;

    return this.http.post<AuthResponse>(url, userData).pipe(
      tap((response) => {
        // Al registrarse con éxito, inicio sesión automáticamente con el token recibido.
        if (response.token) {
          this.setSession(
            response.token,
            response.nombre_usuario,
            response.id_usuario
          );
        }
      })
    );
  }

  // Cierro la sesión eliminando todo rastro del usuario en el LocalStorage y actualizando los observables.
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('sonora_current_user');
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
  }

  // Método privado auxiliar para guardar los datos de sesión y notificar a la app.
  private setSession(
    token: string,
    nombre_usuario: string,
    id_usuario: number | undefined
  ) {
    localStorage.setItem(this.TOKEN_KEY, token);

    const userPayload = {
      id_usuario: id_usuario,
      nombre_usuario: nombre_usuario,
    };
    localStorage.setItem('sonora_current_user', JSON.stringify(userPayload));

    // Emito los nuevos valores para que la interfaz se actualice al instante.
    this.loggedIn.next(true);
    this.currentUserSubject.next(userPayload);
  }

  // Recupero el token actual si existe.
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Compruebo si tenemos un token guardado para determinar si el usuario está conectado.
  private checkLoginStatus(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Intento recuperar y parsear los datos del usuario guardados en LocalStorage. Si falla, devuelvo null.
  private getUserFromStorage(): any {
    const user = localStorage.getItem('sonora_current_user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }
}
