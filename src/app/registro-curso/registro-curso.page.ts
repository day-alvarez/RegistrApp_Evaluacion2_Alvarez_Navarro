import { Component, OnInit } from '@angular/core';
import { PresenteprofeService } from '../services/presenteprofe.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-registro-curso',
  templateUrl: './registro-curso.page.html',
  styleUrls: ['./registro-curso.page.scss'],
})
export class RegistroCursoPage implements OnInit {

  usuario: string | null = null;

  
  public nombre: string;
  public sigla: string;
  public institucion: string;
  public descripcion: string;

  public codigoError = false;
  public runError = false;
  public nombreError = false;
  public apellidoError = false;
  public correoError = false;
  public perfilError = false;
  constructor(private router: Router, private route: ActivatedRoute, private presenteprofeService: PresenteprofeService, private navCtrl: NavController, private alertController: AlertController) {
    this.nombre ='';
    this.sigla='';
    this.institucion='';
    this.descripcion='';
   }

  async ngOnInit() {
    const token = await this.presenteprofeService.getToken();
    console.log('Token de autenticación:', token);

    this.usuario = localStorage.getItem('usuario'); 
  }
  volver() {
    this.navCtrl.back();  // Regresa a la página anterior
  }

  async registroCurso() {
    this.resetErrors(); 

    if (!this.nombre) this.codigoError = true;
    if (!this.sigla) this.runError = true;
    if (!this.institucion) this.nombreError = true;
    if (!this.descripcion) this.apellidoError = true;

    if (this.nombre && this.sigla && this.institucion && this.descripcion) {
      const courseData = {
        nombre: this.nombre,
        sigla: this.sigla,
        institucion: this.institucion,
        descripcion: this.descripcion,
      };
    
      (await this.presenteprofeService.registroCurso(courseData)).subscribe(
        (response:any) => {
          console.log('Curso registrado exitosamente', response);
          this.showAlert('Registro Exitoso', 'Curso registrado correctamente');
          this.router.navigate(['/profesor']); 

        },
        (error: any) => {
          console.error('Error al registrar el curso', error);
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

  logout() {
    console.log('Cerrar sesión');
    this.router.navigate(['/login']); 
  }
}
