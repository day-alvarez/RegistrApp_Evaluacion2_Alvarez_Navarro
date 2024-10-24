import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenteprofeService {
  private apiURL = 'https://www.presenteprofe.cl/api/v1';  

  constructor(private http: HttpClient) { }

  // Método para el inicio de sesión
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiURL}/auth`;  
    const payload = {
      correo: username,
      password: password
    };
    return this.http.post(url, payload);
  }
  
  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiURL}/usuarios`, userData); 
  }

  // Método para obtener cursos del usuario
  getCursos(username: string): Observable<any> {
    const url = `${this.apiURL}/cursos`;  
    const params = new HttpParams().set('user', username); 
    return this.http.get<any>(url, { params });  
  }

  // Método para obtener un curso por ID
  getCursoById(username: string, cursoId: string): Observable<any> {
    const url = `${this.apiURL}/cursos/${cursoId}`; 
    const params = new HttpParams().set('user', username); 
    return this.http.get<any>(url, { params }); 
  }

  // Método para recuperar la contraseña
  recuperarContrasena(body: { correo: string }): Observable<any> {
    // Cambiar la ruta a la correcta para la recuperación de contraseña
    return this.http.post(`${this.apiURL}/auth/recuperar`, body);
  }
}
