import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PresenteprofeService } from '../services/presenteprofe.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  public codigo: string;
  public run: string;
  public nombre: string;
  public apellido: string;
  public correo: string;
  public perfil: string;

  constructor(private presenteprofe: PresenteprofeService, private router: Router) {
    // Inicializar variables
    this.codigo = '';
    this.run = '';
    this.nombre = '';
    this.apellido = '';
    this.correo = '';
    this.perfil = '';
  }

  register() {
    const userData = {
      codigo: this.codigo,
      run: this.run,
      nombre: this.nombre,
      apellido: this.apellido,
      correo: this.correo,
      perfil: this.perfil,
    };
  
    this.presenteprofe.register(userData).subscribe(
      (response) => {
        console.log('Usuario registrado exitosamente', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al registrar el usuario', error);
        alert(`Error ${error.status}: ${error.error.message || 'Error desconocido'}`); // Mostrar un mensaje de error
      }
    );
  }
  
  
}
