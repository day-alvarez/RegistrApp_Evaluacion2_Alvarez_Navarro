import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PresenteprofeService } from '../services/presenteprofe.service';

import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';




@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {
  username: string = '';
  submenu: boolean = false; 
  usuario: string | null = null;
  cursos: any[] = [];
  result : string = "";

  constructor(private router: Router, private route: ActivatedRoute, private presenteprofeService: PresenteprofeService) { 

  }
  

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['nombre'] || 'No existe';
    });
    this.usuario = localStorage.getItem('usuario');  // Obtener el usuario de localStorage
    if (this.usuario) {
      this.cargarCursos();  // Cargar los cursos si el usuario no es null
    } else {
      console.error('No se encontró un usuario válido');
    }
  }

  cargarCursos() {
    this.presenteprofeService.getCursos(this.usuario!).subscribe(
      (response) => {
        this.cursos = response.cursos;  // Asignamos los cursos obtenidos a la variable 'cursos'
        console.log(this.cursos);  // Muestra los cursos en la consola
      },
      (error) => {
        console.error('Error al cargar los cursos', error);
      }
    );
  }

  async scan(): Promise<void> {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL
    });
    this.result = result.ScanResult;
  }
  ingresarCurso(cursoId: string) {
    console.log('Ingresando al curso con ID:', cursoId);
    // Lógica adicional para ingresar al curso, por ejemplo redirigir a otra página
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