import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PresenteprofeService } from '../services/presenteprofe.service';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
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
  constructor(private router: Router, private route: ActivatedRoute, private presenteprofeService: PresenteprofeService, private navCtrl: NavController) { 
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
       this.username = params['nombre']||'No existe';
    })
    this.usuario = localStorage.getItem('usuario');  // Obtener el usuario de localStorage
    if (this.usuario) {
      this.cargarCursos();  // Cargar los cursos si el usuario no es null
    } else {
      console.error('No se encontró un usuario válido');
    }
  }
  cargarCursos() {
    this.presenteprofeService.getCursos(this.usuario!).subscribe(  // Asegúrate de usar el operador de afirmación no nulo (!)
      (response) => {
        this.cursos = response.cursos;  // Asignamos los cursos obtenidos a la variable 'cursos'
        console.log(this.cursos);  // Muestra los cursos en la consola
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

 

  
}