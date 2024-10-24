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
    return this.http.post(`${this.apiURL}/usuarios`, userData); // Asegúrate de que 'apiURL' sea correcto
  }
  
  

  // Método para obtener cursos del usuario
  getCursos(username: string): Observable<any> {
    const url = `${this.apiURL}/cursos`;  
    const params = new HttpParams().set('user', username); // Configura los parámetros de la URL
    return this.http.get<any>(url, { params });  // Pasamos los parámetros en el objeto de opciones
  }

  // Método para obtener un curso por ID
  getCursoById(username: string, cursoId: string): Observable<any> {
    const url = `${this.apiURL}/cursos/${cursoId}`; // Ruta para obtener el curso
    const params = new HttpParams().set('user', username); // Configura el parámetro de usuario
    return this.http.get<any>(url, { params }); // Llamada a la API para obtener el curso
  }

  // Método alternativo para obtener cursos (redundante, puedes eliminarlo si no lo usas)
  getCursos2(username: string) {
    return this.http.get(`${this.apiURL}/cursos?user=${username}`);
  }
}
