import { Component, OnInit } from '@angular/core';
import { PresenteprofeService } from '../services/presenteprofe.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {
  curso: string = '';
  mostrarBotonQR: boolean = true; // Variable de estado para el botón

  nombre: string = '';
  imagen: string = '';
  selectedSegment: string = 'mi-espacio';
  qrData: string | null = null;
  selectedTab: string = 'curso'; // "curso" es la pestaña predeterminada
  fecha: string = '';
  titulo: string='';
  mensaje: string='';
  clases: any[] = []; // Array para almacenar las clases
  showError: boolean = false;
  hora_inicio: string = '';
  hora_termino: string = '';
  showRegistrarForm: boolean = false; // Nueva variable de estado
  claseRegistrada: any = null; // Propiedad para almacenar la clase registrada
  anuncioregistrado: any = null

  showCrearAnuncioForm: boolean = false;

  codigo_Web: string ='';
  anuncios: any[] = []; // Lista de anuncios

  public codigoError = false;
  public runError = false;
  public nombreError = false;
  public apellidoError = false;
  public correoError = false;
  public perfilError = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private presenteprofeService: PresenteprofeService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.curso = params['curso'] || 'No existe';
      this.nombre = params['nombre'] || 'Sin nombre';
      this.imagen = params['imagen'] || 'Sin imagen';
      console.log(this.curso);
      console.log(this.nombre);
  
      // Verificar si ya existe la clase registrada en localStorage
      const storedClass = localStorage.getItem('claseRegistrada');
      if (storedClass) {
        try {
          this.claseRegistrada = JSON.parse(storedClass);
        } catch (error) {
          console.error('Error al parsear clase registrada:', error);
        }
      }
  
      // Cargar las clases solo para el curso actual
      const clasesGuardadas = localStorage.getItem(`clasesRegistradas_${this.curso}`);
      if (clasesGuardadas) {
        try {
          this.clases = JSON.parse(clasesGuardadas);
          console.log('Clases cargadas para el curso:', this.clases);
        } catch (error) {
          console.error('Error al parsear las clases:', error);
        }
      }
  
      // Cargar los anuncios solo para el curso actual
      const anunciosGuardados = localStorage.getItem(`anuncioregistrado_${this.curso}`);
  
      // Verificar si existe un valor válido en 'anuncioregistrado_${this.curso}'
      if (anunciosGuardados && anunciosGuardados !== 'undefined' && anunciosGuardados !== 'null' && anunciosGuardados.trim() !== '') {
        try {
          this.anuncios = JSON.parse(anunciosGuardados);
          console.log('Anuncios cargados para el curso:', this.anuncios);
        } catch (error) {
          console.error('Error al parsear los anuncios:', error);
        }
      } else {
        console.log('No se encontraron anuncios para el curso:', this.curso);
      }
    });
  }
  
  

  toggleRegistrarForm() {
    this.showRegistrarForm = !this.showRegistrarForm;
  }
  obtenerDiaSemana(fecha: string): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fechaObj = new Date(fecha);
    return diasSemana[fechaObj.getUTCDay()];
  }
  cargarClases() {
    this.presenteprofeService.getClasesCurso(this.curso, this.codigo_Web).subscribe(
      (response: any) => {
        this.clases = response.clases || [];
        this.showError = false;
        
      },
      (error) => {
        console.error('Error al cargar clases', error);
        this.showError = true;
      }
    );
  }
  cargarAnuncios() {
    // Intentar cargar anuncios desde el servidor
    this.presenteprofeService.getAnunciosCurso(this.curso).subscribe(
      (response: any) => {
        this.anuncios = response.anuncios || [];
        this.showError = false;
      },
      (error: any) => {
        console.error('Error al cargar anuncios:', error);
        this.showError = true;
      }
    );
  }
  async crearClase() {
    if (this.fecha && this.hora_inicio && this.hora_termino) {
      const nuevaClase = {
        fecha: this.fecha,
        hora_inicio: this.hora_inicio,
        hora_termino: this.hora_termino
      };
  
      // Enviar la nueva clase al servidor
      (await this.presenteprofeService.registroClase(nuevaClase, this.curso)).subscribe(
        (response: any) => {
          console.log('Clase creada exitosamente:', response);
  
          // Verificar si la respuesta contiene la clase
          if (response && response.clase) {
            this.claseRegistrada = response.clase;
  
            // Obtener las clases guardadas de manera segura desde localStorage
            let clasesGuardadas = [];
            const clasesFromStorage = localStorage.getItem(`clasesRegistradas_${this.curso}`);
  
            // Solo intentar parsear si el valor no es null ni undefined
            if (clasesFromStorage && clasesFromStorage !== 'undefined' && clasesFromStorage !== 'null' && clasesFromStorage.trim() !== '') {
              try {
                clasesGuardadas = JSON.parse(clasesFromStorage);
              } catch (error) {
                console.error('Error al parsear las clases desde localStorage:', error);
              }
            }
  
            // Agregar la nueva clase
            clasesGuardadas.push(this.claseRegistrada);
  
            // Guardar la lista actualizada en localStorage
            localStorage.setItem(`clasesRegistradas_${this.curso}`, JSON.stringify(clasesGuardadas));
  
            // Actualizar la lista de clases en la vista
            this.clases = clasesGuardadas;
  
            // Resetear el formulario y mostrar éxito
            this.showAlert('Éxito', 'Clase creada correctamente.');
          } else {
            console.error('Respuesta del servidor no válida');
            this.showAlert('Error', 'Respuesta del servidor no válida');
          }
        },
        (error) => {
          console.error('Error al crear clase:', error);
          this.showAlert('Error', `Error ${error.status}: ${error.error.message || 'Error desconocido'}`);
        }
      );
    } else {
      this.showAlert('Error', 'Por favor, completa todos los campos.');
    }
  }
  

  async crearAnuncio() {
    this.resetErrors();
    if (this.titulo && this.mensaje) {
      const nuevoAnuncioData = {
        titulo: this.titulo,
        mensaje: this.mensaje,
      };
  
      // Enviar el nuevo anuncio al servidor
      (await this.presenteprofeService.crearAnuncio(this.curso, nuevoAnuncioData)).subscribe(
        (response: any) => {
          console.log('Anuncio creado exitosamente:', response);
          
          // Verificar si la respuesta contiene el anuncio
          if (response && response.anuncio) {
            this.anuncioregistrado = response.anuncio;
  
            // Obtener los anuncios guardados de manera segura desde localStorage
            let anunciosGuardados = [];
            const anunciosFromStorage = localStorage.getItem(`anuncioregistrado_${this.curso}`);
  
            // Solo intentar parsear si el valor no es null ni undefined
            if (anunciosFromStorage && anunciosFromStorage !== 'undefined' && anunciosFromStorage !== 'null' && anunciosFromStorage.trim() !== '') {
              try {
                anunciosGuardados = JSON.parse(anunciosFromStorage);
              } catch (error) {
                console.error('Error al parsear los anuncios desde localStorage:', error);
              }
            }
  
            // Agregar el nuevo anuncio
            anunciosGuardados.push(this.anuncioregistrado);
  
            // Guardar la lista actualizada en localStorage
            localStorage.setItem(`anuncioregistrado_${this.curso}`, JSON.stringify(anunciosGuardados));
  
            // Actualizar la lista de anuncios en la vista
            this.anuncios = anunciosGuardados;
  
            // Resetear el formulario y mostrar éxito
            this.showAlert('Éxito', response.message || 'Anuncio creado correctamente');
          } else {
            console.error('Respuesta del servidor no válida');
            this.showAlert('Error', 'Respuesta del servidor no válida');
          }
        },
        (error: any) => {
          console.error('Error al crear anuncio:', error);
          this.showAlert('Error', error.message || 'No se pudo crear el anuncio');
        }
      );
    } else {
      this.showAlert('Error', 'Por favor, completa todos los campos.');
    }
  }
  
  

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  resetErrors() {
    this.codigoError = false;
    this.runError = false;
    this.nombreError = false;
    this.apellidoError = false;
    this.correoError = false;
    this.perfilError = false;
  }

  generarQR(clase: any) {
    if (clase && clase.codigo_web) {
      // Si el QR ya está visible, lo ocultamos, de lo contrario, lo mostramos
      clase.mostrarQR = !clase.mostrarQR;
      if (!clase.mostrarQR) {
        clase.qrData = null; // Eliminar QR si lo estamos ocultando
      } else {
        clase.qrData = clase.codigo_web; // Generar el QR
      }
      console.log('Generar QR para la clase:', clase.codigo_web);
    } else {
      console.error('No se puede generar el QR: Clase o código_web no está disponible.');
      clase.qrData = null;
    }
  }

  
  
  volver() {
    this.navCtrl.back(); // Regresa a la página anterior
  }



  
  toggleCrearAnuncioForm() {
    this.showCrearAnuncioForm = !this.showCrearAnuncioForm;
  }
  verDetalleClase(curso: string, clase: any) {
    if (curso && clase.codigo_web) {
      this.router.navigate(['/detalle-curso'], {
        queryParams: {
          curso: this.curso,
          codigo_web: clase.codigo_web // Asegúrate de usar el mismo nombre que espera el componente destino
        }
      });
    } else {
      console.error('Clase o código_web no válido:', clase);
    }
  }
}
