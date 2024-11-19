import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError} from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PresenteprofeService {
  private apiURL = 'https://www.presenteprofe.cl/api/v1';  

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.create();
  }

  // Método auxiliar para obtener headers con token de autenticación
  private async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authenticated');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  // Método para el inicio de sesión
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiURL}/auth`;  
    const payload = {
      correo: username,
      password: password
    };
    return this.http.post(url, payload).pipe(
      tap(async (response: any) => {
        if (response.data) {
          await this.storage.set('user_id', response.data.id);
          if (response.auth && response.auth.token) {
            await this.storage.set('auth_token', response.auth.token);
          }
          await this.storage.set('user_perfil', response.data.perfil);
          await this.storage.set('nombre_completo', response.data.nombre_completo);
        }
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(() => new Error('Failed to log in'));
      })
    );
  }
  async saveToken(token: string): Promise<void> {
    // Implementation to save the token, e.g., in local storage
    localStorage.setItem('authToken', token);
  }
  // Obtener token del almacenamiento
  async getToken(): Promise<string | null> {
    return await this.storage.get('auth_token');
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
    return this.http.post(`${this.apiURL}/auth/recuperar`, body);
  }

  //Metodo para registrar nuevo Curso
  async registroCurso(courseData: any):Promise<Observable<any>>{
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiURL}/cursos`, courseData, { headers })
  }
  async registroClase(courseData: any, cursoId: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiURL}/cursos/${cursoId}/clase`, courseData, { headers });
  }
}
