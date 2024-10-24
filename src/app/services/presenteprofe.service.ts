import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenteprofeService {
  private apiURL = 'https://www.presenteprofe.cl/api/v1';  

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiURL}/auth`;  
    const payload = {
      correo: username,
      password: password
    };
    return this.http.post(url, payload);
  }
  getCursos(username: string): Observable<any> {
    const url = `${this.apiURL}/cursos`;  
    const params = new HttpParams().set('user', username); // Aquí se configuran los parámetros de la URL
    return this.http.get<any>(url, { params });  // Pasamos los parámetros en el objeto de opciones
  }
  getCursoById(username: string, cursoId: string): Observable<any> {
    const url = `${this.apiURL}/cursos/${cursoId}`; // Asegúrate de que 'apiURL' y 'cursos' sean correctos
    const params = new HttpParams().set('user', username);// NUEVO
    //return this.http.get<any>(url);  // Llamada a la API para obtener el curso
    return this.http.get<any>(url, { params });
  }
  getCursos2(username: string) {
    return this.http.get(`${this.apiURL}/cursos?user=${username}`);
  }
  

  
}