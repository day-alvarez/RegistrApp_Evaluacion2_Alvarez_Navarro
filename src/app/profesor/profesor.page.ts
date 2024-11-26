import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PresenteprofeService } from '../services/presenteprofe.service';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ModalController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
})
export class ProfesorPage implements OnInit {
  username: string = '';
  submenu: boolean = false;
  usuario: string | null = null;
  cursos: any[] = [];
  
  constructor(private router: Router, private route: ActivatedRoute, private presenteprofeService: PresenteprofeService, private navCtrl: NavController, private alertController: AlertController) { 
  }

  async ngOnInit() {
    const token = await this.presenteprofeService.getToken();
    console.log('Token de autenticación:', token);

    this.route.queryParams.subscribe(params=>{
       this.username = params['nombre']||'No existe';
    })
    this.usuario = localStorage.getItem('usuario'); 
    if (this.usuario) {
      // Nos suscribimos al observable para que se actualice cuando los cursos cambien
      this.presenteprofeService.getCursos(this.usuario!).subscribe(
        (response) => {
          this.cursos = response.cursos;  
          console.log(this.cursos);  
        },
        (error) => {
          console.error('Error al cargar los cursos', error);
        }
      );
    } else {
      console.error('No se encontró un usuario válido');
    }

    // Aquí nos suscribimos al BehaviorSubject para obtener los cursos
    this.presenteprofeService.cursos$.subscribe(cursos => {
      this.cursos = cursos;
    });
  }
  miperfil() {
    this.navCtrl.navigateForward('/perfil', {
      queryParams: {
        username: this.username, // Pasar el nombre del usuario si es necesario
        user_id: localStorage.getItem('user_id'), // Opcional: pasa el ID del usuario si es necesario
      },
    });
  }
  

  cargarCursos() {
    this.presenteprofeService.getCursos(this.usuario!).subscribe(  
      (response) => {
        this.cursos = response.cursos;  
        console.log(this.cursos);  
      },
      (error) => {
        console.error('Error al cargar los cursos', error);
      }
    );
  }
  
  ingresarCurso(cursoId: string) {
    this.presenteprofeService.getCursoById(this.usuario!, cursoId).subscribe(
      (response) => {
        console.log(response);
        if (response.curso.id == cursoId) {

          this.navCtrl.navigateForward(['/cursos'], { 
            queryParams: { 
              curso: response.curso.id, 
              nombre: response.curso.nombre,
              imagen: response.curso.imagen
            } 
          });
          }
      },(error) => {
        console.error('Error de inicio de sesión', error);

    })
  }
  
  
  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as HTMLIonMenuElement).open();
    }
  }

  togglesubmenu() { 
    this.submenu = !this.submenu;
  }

  logout() {
    console.log('Cerrar sesión');
    this.router.navigate(['/login']); 
  }

 
  registCurso(){
    this.navCtrl.navigateForward(['/registro-curso'])
  }
  
}