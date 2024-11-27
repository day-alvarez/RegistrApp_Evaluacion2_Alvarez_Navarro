import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PresenteprofeService } from '../services/presenteprofe.service';
import { NavController } from '@ionic/angular';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { ModalController, AlertController } from '@ionic/angular';
import {QrScannerService} from "../services/qr-scanner.service"; 

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  username: string = '';
  usuario: string | null = null;
  cursos: any[] = [];
  result: string = '';
  codigo_web: string = '';
  showMisCursos: boolean = false;
  showMatricularse: boolean = false;
  registroExitoso: boolean = false;
  mensajeError: string = ''; // Mensaje de error
  mensajeExitoso: string = ''; // Mensaje de éxito


  constructor(
    private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private presenteprofeService: PresenteprofeService,
    private alertController: AlertController,
    private readonly qrScannerService: QrScannerService,

  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.username = params['nombre'] || 'No existe';
    });
    this.usuario = localStorage.getItem('usuario');
    if (this.usuario) {
      this.cargarCursos();
    } else {
      console.error('No se encontró un usuario válido');
    }
  }

  miperfil() {
    this.navCtrl.navigateForward('/perfil', {
      queryParams: {
        username: this.username,
        user_id: localStorage.getItem('user_id'),
      },
    });
  }

  async cargarCursos() {
    (await this.presenteprofeService.getCursosEstudiante(this.usuario!)).subscribe(
      (response: any) => {
        this.cursos = response.cursos;
        console.log(this.cursos);
      },
      (error: any) => {
        console.error('Error al cargar los cursos', error);
      }
    );
  }

  async asistirClase() {
    this.mensajeError = ''; // Limpiar mensaje de error antes de hacer la solicitud
    this.mensajeExitoso = ''; // Limpiar mensaje de éxito

    (await this.presenteprofeService.asistirClase(this.codigo_web)).subscribe(
      async (response: any) => {
        console.log('Has asistido correctamente', response);
        this.registroExitoso = true;
        this.mensajeExitoso = 'Registro exitoso';
        this.codigo_web = ''; // Limpiar el campo de entrada
        // Mostrar mensaje de éxito usando showAlert
        await this.showAlert('Éxito', 'Te has registrado correctamente en el curso.');
      },
      async (error: any) => {
        console.error('Error al asistir el curso', error);
        this.mensajeError = 'Código inválido o error al registrar asistencia.';
        // Mostrar mensaje de error usando showAlert
        await this.showAlert('Error', 'Código inválido o error al registrar asistencia.');
      }
    );
  }

  // Función para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }


    async scan(): Promise<void> {
      const barcodes = await this.qrScannerService.scan() //esto abre la camara para escanear
      console.log(barcodes)
      //aqui el codigo de logica con los qrs escaneados
    }

  verHistorial(cursoId: string) {
    console.log(`Ver historial del curso con ID: ${cursoId}`);
  }

  reportarInasistencia(cursoId: string) {
    console.log(`Reportar inasistencia al curso con ID: ${cursoId}`);
  }

  toggleSection(section: string) {
    if (section === 'misCursos') {
      this.showMisCursos = !this.showMisCursos;
      this.showMatricularse = false; 
    } else if (section === 'matricularse') {
      this.showMatricularse = !this.showMatricularse; 
      this.showMisCursos = false; 
    }
  }


  logout() {
    console.log('Cerrar sesión');
    this.router.navigate(['/login']);
  }
  
}
