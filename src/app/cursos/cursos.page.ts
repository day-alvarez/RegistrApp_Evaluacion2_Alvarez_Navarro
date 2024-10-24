import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PresenteprofeService } from '../services/presenteprofe.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {
  curso: string=''; //ID del Curso
  nombre: string=''; //Nombre curso
  imagen: string='';
  selectedSegment: string = 'mi-espacio';
  qrData: string | null = null;

  constructor(private route: ActivatedRoute, private presenteprofeService: PresenteprofeService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
      this.curso = params['curso']||'No existe';
      this.nombre = params['nombre'] || 'Sin nombre';
      this.imagen= params['imagen'] || 'Sin imagen';
      console.log(this.curso);
      console.log(this.nombre);
   })
  }
  generarQR() {
    // Genera un QR con un contenido fijo o dinámico
    this.qrData = `QR generado el: ${new Date().toLocaleString()}`; // Puedes cambiar el contenido a lo que necesites
    console.log('Generar QR:', this.qrData);
  }
  
}