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
  codigo_web : string ='';

  showRegistrarForm: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private presenteprofeService: PresenteprofeService) { 

  }
  

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['nombre'] || 'No existe';
    });
    this.usuario = localStorage.getItem('usuario');  
    if (this.usuario) {
      this.cargarCursos(); 
    } else {
      console.error('No se encontró un usuario válido');
    }
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
  async asistirClase(){
    (await this.presenteprofeService.asistirClase(this.codigo_web)).subscribe(
      (response:any) => {
        console.log('Has asistido correctamente', response);

      },
      (error: any) => {
        console.error('Error al asistir el curso', error);
        
      }
    )
  }
  async scan(): Promise<void> {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL
    });
    this.result = result.ScanResult;
  }
  ingresarCurso(cursoId: string) {
    console.log('Ingresando al curso con ID:', cursoId);
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
  

  toggleRegistrarForm() {
    this.showRegistrarForm = !this.showRegistrarForm;
  }
}