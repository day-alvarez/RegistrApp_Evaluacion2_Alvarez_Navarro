import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PresenteprofeService } from '../services/presenteprofe.service'; // Asegúrate de que la ruta sea correcta
import { AlertController } from '@ionic/angular'; // Importar el controlador de alertas

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

  // Variables para manejar los errores
  public codigoError = false;
  public runError = false;
  public nombreError = false;
  public apellidoError = false;
  public correoError = false;
  public perfilError = false;

  constructor(
    private presenteprofe: PresenteprofeService, 
    private router: Router, 
    private alertController: AlertController 
  ) {
    this.codigo = '';
    this.run = '';
    this.nombre = '';
    this.apellido = '';
    this.correo = '';
    this.perfil = '';
  }

 
  register() {
    this.resetErrors(); 

    if (!this.codigo) this.codigoError = true;
    if (!this.run) this.runError = true;
    if (!this.nombre) this.nombreError = true;
    if (!this.apellido) this.apellidoError = true;
    if (!this.correo) this.correoError = true;
    if (!this.perfil) this.perfilError = true;

    if (this.codigo && this.run && this.nombre && this.apellido && this.correo && this.perfil) {
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
          this.showAlert('Registro Exitoso', 'Usuario registrado correctamente');
          this.router.navigate(['/login']); 
        },
        (error) => {
          console.error('Error al registrar el usuario', error);
          this.showAlert('Error', `Error ${error.status}: ${error.error.message || 'Error desconocido'}`); 
        }
      );
    } else {
      this.showAlert('Error', 'Por favor, completa todos los campos.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  resetErrors() {
    this.codigoError = false;
    this.runError = false;
    this.nombreError = false;
    this.apellidoError = false;
    this.correoError = false;
    this.perfilError = false;
  }
}
