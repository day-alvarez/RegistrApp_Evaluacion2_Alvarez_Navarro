import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PresenteprofeService } from '../services/presenteprofe.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public username: string;
  public password: string;
  passwordType: string = 'password'; 
  passwordIcon: string = 'eye-off-outline'; 
  


  constructor(private navCtrl: NavController, private router: Router, private presenteprofe: PresenteprofeService) {
    this.username = '';
    this.password = '';
  }
  togglePasswordVisibility(): void {
 
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }
  onLogin() {
    this.presenteprofe.login(this.username, this.password).subscribe(
      async (response) => {
        console.log(response);
        if (response.auth && response.auth.token) {
          // Guardar el token de autenticación
          await this.presenteprofe.saveToken(response.auth.token);
          if (response.data.perfil == "docente") {
            localStorage.setItem('usuario', this.username);
            this.navCtrl.navigateForward(['/profesor'], { queryParams: { nombre: response.data.nombre } });
          } else if (response.data.perfil == "estudiante") {
            localStorage.setItem('usuario', this.username);
            this.navCtrl.navigateForward(['/alumno'], { queryParams: { nombre: response.data.nombre } });
          }
          // Guardar también el perfil en el almacenamiento local por si lo necesitas más tarde
          //await this.presenteprofe.saveUserProfile(response.data.perfil, response.data.nombre_completo);
        }
      },
      (error) => {
        console.error('Error de inicio de sesión', error);
      }
    );
  }

  openUrl(url: string) {
    window.open(url, '_balck');
  }

  ngOnInit() {}
}
