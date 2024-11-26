import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PresenteprofeService } from '../services/presenteprofe.service';

@Component({
  selector: 'app-detalle-curso',
  templateUrl: './detalle-curso.page.html',
  styleUrls: ['./detalle-curso.page.scss'],
})
export class DetalleCursoPage implements OnInit {

  curso: string = ''; // cursoId ahora es un string
  codigo_web: string = ''; // Código web recibido desde detalle
  asistencia: any[] = [];
  claseInfo: any;
  totalAsistencias: number = 0;
  mensaje: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private presenteprofeService: PresenteprofeService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      this.curso = params['curso'] || ''; 
      this.codigo_web = params['codigo_web'] || '';
      console.log('curso:', this.curso);
      console.log('codigo_web:', this.codigo_web);
  
      if (this.curso && this.codigo_web) {
        this.cargarHistorialAsistencia(this.curso, this.codigo_web);
      } else {
        console.warn('curso o código de clase no está definido correctamente');
      }
    });
  }
  
  async cargarHistorialAsistencia(curso: string, codigo_web: string) {
    console.log('Cargando historial de asistencia para cursoId:', curso, 'y codigo_web:', codigo_web);
    try {
      const asistenciaObs = await this.presenteprofeService.obtenerHistorialAsistencia(curso, codigo_web);
      asistenciaObs.subscribe(
        (response: any) => {
          console.log('Respuesta de asistencia:', response);
          this.mensaje = response.message;
          this.claseInfo = response.clase;
          this.totalAsistencias = response.total;
          this.asistencia = response.asistencias;
        },
        (error: any) => {
          console.error('Error al cargar el historial de asistencia:', error);
        }
      );
    } catch (error) {
      console.error('Error al solicitar el historial de asistencia:', error);
    }
  }
} 