import { Component, OnInit } from '@angular/core';
import { PresenteprofeService } from '../services/presenteprofe.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {
  curso: string = '';
  nombre: string = '';
  imagen: string = '';
  selectedSegment: string = 'mi-espacio';
  qrData: string | null = null;
  selectedTab: string = 'curso'; // "curso" es la pestaña predeterminada
  fecha: string = '';
  hora_inicio: string = '';
  hora_termino: string = '';
  showRegistrarForm: boolean = false; // Nueva variable de estado
  claseRegistrada: any = null; // Propiedad para almacenar la clase registrada

  public codigoError = false;
  public runError = false;
  public nombreError = false;
  public apellidoError = false;
  public correoError = false;
  public perfilError = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private presenteprofeService: PresenteprofeService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.curso = params['curso'] || 'No existe';
      this.nombre = params['nombre'] || 'Sin nombre';
      this.imagen = params['imagen'] || 'Sin imagen';
      console.log(this.curso);
      console.log(this.nombre);

      // Verificar si ya existe la clase registrada en localStorage
      const storedClass = localStorage.getItem('claseRegistrada');
      if (storedClass) {
        this.claseRegistrada = JSON.parse(storedClass);
      }
    });
  }

  toggleRegistrarForm() {
    this.showRegistrarForm = !this.showRegistrarForm;
  }

  async registroCurso() {
    this.resetErrors();

    if (this.fecha && this.hora_inicio && this.hora_termino) {
      const courseData = {
        fecha: this.fecha,
        hora_inicio: this.hora_inicio,
        hora_termino: this.hora_termino,
      };

      (await this.presenteprofeService.registroClase(courseData, this.curso)).subscribe(
        (response: any) => {
          console.log('Curso registrado exitosamente', response);
          this.claseRegistrada = response.clase; // Almacena la clase registrada
          
          // Guardar la clase registrada en localStorage
          localStorage.setItem('claseRegistrada', JSON.stringify(this.claseRegistrada));

          this.showAlert('Clase Registrada', 'Clase registrada correctamente');
        },
        (error: any) => {
          console.error('Error al registrar el clase', error);
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
      buttons: ['OK'],
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

  generarQR() {
    if (this.claseRegistrada) {
      // Generar QR con la información de la clase registrada
      this.qrData = `Clase: ${this.claseRegistrada.curso}
                      Día: ${this.claseRegistrada.dia}
                      Fecha: ${this.claseRegistrada.fecha}
                      Hora Inicio: ${this.claseRegistrada.hora_inicio}
                      Hora Término: ${this.claseRegistrada.hora_termino}`;
      console.log('Generar QR:', this.qrData);
    }
  }

  volver() {
    this.navCtrl.back(); // Regresa a la página anterior
  }
}
