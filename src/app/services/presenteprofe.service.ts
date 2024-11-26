import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject} from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PresenteprofeService {
  private apiURL = 'https://www.presenteprofe.cl/api/v1';  

  private cursosSubject = new BehaviorSubject<any[]>([]);
  cursos$ = this.cursosSubject.asObservable(); // Observable para que los componentes se suscriban

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

  // Método para obtener cursos del usuario y actualizar el estado
  getCursos(username: string): Observable<any> {
    const url = `${this.apiURL}/cursos`;  
    const params = new HttpParams().set('user', username); 
    return this.http.get<any>(url, { params }).pipe(
      tap(response => {
        // Actualizamos el BehaviorSubject con la nueva lista de cursos
        this.cursosSubject.next(response.cursos); 
      })
    );
  }
  getCursosEstudiante(username: string): Observable<any> {
    const url = `${this.apiURL}/estudiante/cursos`;  
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
  getClasesCurso(cursoId: string, code: string): Observable<any> {
    const url = `${this.apiURL}/cursos/${cursoId}/clase/${code}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener clases:', error);
        return throwError(() => new Error('Error al obtener clases'));
      })
    );
  }
  //Metodo para registrar nuevo Curso
  async registroCurso(courseData: any): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiURL}/cursos`, courseData, { headers }).pipe(
      // Una vez registrado el curso, se actualizan los cursos del servidor
      tap(() => {
        // Llamamos a getCursos para refrescar la lista de cursos después de registrar uno nuevo
        this.getCursos(localStorage.getItem('usuario')!).subscribe(); // O puedes pasar el username de alguna otra forma
      })
    );
  }
  async registroClase(courseData: any, cursoId: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiURL}/cursos/${cursoId}/clase`, courseData, { headers });
  }
  getAnunciosCurso(cursoId: string): Observable<any> {
    const url = `${this.apiURL}/cursos/${cursoId}/anuncios`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener anuncios:', error);
        return throwError(() => new Error('Error al obtener anuncios'));
      })
    );
  }
  // Método para crear un nuevo anuncio en un curso
async crearAnuncio(cursoId: string, anuncioData: any): Promise<Observable<any>> {
  const headers = await this.getAuthHeaders();
  const url = `${this.apiURL}/cursos/${cursoId}/anuncios`;
  return this.http.post(url, anuncioData, { headers }).pipe(
    catchError((error) => {
      console.error('Error al crear anuncio:', error);
      return throwError(() => new Error(error.error.message || 'Error al crear anuncio'));
    })
  );
}
  async asistirClase(codigo:string): Promise<Observable<any>> { 

    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiURL}/clases/${codigo}/asistencia`, codigo, { headers });
  }
  async getperfilusuario(): Promise<Observable<any>> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authenticated');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const url = `${this.apiURL}/auth/me`;
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener el perfil del usuario:', error);
        return throwError(() => new Error('Error al obtener perfil'));
      })
    );
  }
}