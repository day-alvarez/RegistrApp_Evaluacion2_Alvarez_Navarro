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

  constructor(private navCtrl: NavController, private router: Router, private presenteprofe: PresenteprofeService) {
    this.username = '';
    this.password = '';
  }

  onLogin() {
    this.presenteprofe.login(this.username, this.password).subscribe(
      (response) => {
        console.log(response);
        if (response.data.perfil == "docente") {
          localStorage.setItem('usuario', this.username);
          this.navCtrl.navigateForward(['/profesor'], { queryParams: { nombre: response.data.nombre } });
        } else if (response.data.perfil == "estudiante") {
          localStorage.setItem('usuario', this.username);
          this.navCtrl.navigateForward(['/alumno'], { queryParams: { nombre: response.data.nombre } });
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
