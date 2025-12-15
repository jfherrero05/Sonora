import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../interfaces/user.interface';
// Si la interfaz de Usuario no existe, la definimos o usamos 'any' temporalmente.

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private currentUserSubject = new BehaviorSubject<any>(
    this.getUserFromStorage()
  );

  constructor() {}

  // Observable para el estado de autenticación
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  login(credentials: any): Observable<boolean> {
    // Simulando llamada a API
    // En una aplicación real, esto verificaría contra el backend.
    // Por ahora, comprobamos contra los usuarios guardados en localStorage.

    const users = JSON.parse(localStorage.getItem('sonora_users') || '[]');
    const user = users.find(
      (u: any) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      this.setSession(user);
      return of(true);
    } else {
      return of(false);
    }
  }

  register(userData: any): Observable<boolean> {
    const users = JSON.parse(localStorage.getItem('sonora_users') || '[]');
    // Comprobar si el usuario ya existe
    if (users.find((u: any) => u.email === userData.email)) {
      return of(false); // El usuario ya existe
    }

    users.push(userData);
    localStorage.setItem('sonora_users', JSON.stringify(users));

    // ¿Auto login tras registro? Normalmente es mejor loguear automáticamente.
    this.setSession(userData);
    return of(true);
  }

  logout() {
    localStorage.removeItem('sonora_current_user');
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
  }

  private setSession(user: any) {
    localStorage.setItem('sonora_current_user', JSON.stringify(user));
    this.loggedIn.next(true);
    this.currentUserSubject.next(user);
  }

  private checkLoginStatus(): boolean {
    const user = localStorage.getItem('sonora_current_user');
    if (!user) return false;
    try {
      const parsed = JSON.parse(user);
      return !!parsed && typeof parsed === 'object';
    } catch (e) {
      return false;
    }
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
