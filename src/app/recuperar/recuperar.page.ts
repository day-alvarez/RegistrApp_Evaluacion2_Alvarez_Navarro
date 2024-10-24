import { Component } from '@angular/core';
import { PresenteprofeService } from '../services/presenteprofe.service'; 
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  public correo: string = '';

  constructor(
    private presenteprofe: PresenteprofeService,
    private alertController: AlertController,
    private router: Router 
  ) {}

  recuperarContrasena() {
    if (!this.correo) {
      this.showAlert('Error', 'Por favor, ingresa tu correo electrónico.');
      return;
    }

    const body = { correo: this.correo };

    this.presenteprofe.recuperarContrasena(body).subscribe(
      (response) => {
        console.log('Solicitud de recuperación enviada', response);
        this.showAlert('Éxito', 'Se ha enviado un correo para recuperar tu contraseña.').then(() => {
          this.router.navigate(['/inicio']); 
        });
      },
      (error) => {
        console.error('Error al enviar la solicitud de recuperación', error);
        this.showAlert('Error', `Error ${error.status}: ${error.error.message || 'Error desconocido'}`);
      }
    );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
