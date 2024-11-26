import { Component, OnInit } from '@angular/core';
import { PresenteprofeService } from '../services/presenteprofe.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userData: any = {}; 

  constructor(private presenteprofeService: PresenteprofeService, private navCtrl: NavController) {}

  async ngOnInit() {
    try {
      const perfilObservable = await this.presenteprofeService.getperfilusuario();
      perfilObservable.subscribe(
        (response) => {
          this.userData = response.data; 
          console.log('Datos del usuario:', this.userData);
        },
        (error) => {
          console.error('Error al obtener el perfil del usuario:', error);
        }
      );
    } catch (error) {
      console.error('Error al inicializar PerfilPage:', error);
    }
  }
  volver() {
    this.navCtrl.back(); 
  }


}  