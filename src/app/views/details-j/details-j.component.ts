import { DataService } from '../../components/services/data.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../components/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Justification } from '../../models/justification.interface';
import { JustificationService } from '../../components/services/justification.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TimeConverter } from '../../components/class/time-converter';

@Component({
  selector: 'app-details-j',
  templateUrl: './details-j.component.html',
  styleUrls: ['./details-j.component.css'],
})
export class DetailsJComponent
  extends TimeConverter
  implements OnInit, OnDestroy
{
  justification: Justification;
  horaExtra: String;
  tipo: string;
  tiempo: string;
  motivoR: string = '';
  mensaje: string;
  isAdmin: boolean;
  flag: boolean;

  //variable que recupera el usuario autenticado desde el servicio authService
  currentUser: string = null;
  currentUserId: string = null;
  //objeto que contendrá el registro relacionado con la justificación
  data: any = null;
  data$: Subscription;
  //objeto que contendrá una copia de los datos del observable.
  just: Justification[] = [];
  just$: Subscription;
  //objeto obtendrá los argumentos enviados(justificación a visualizar)
  navigationExtras: NavigationExtras = {
    state: {
      value: null,
    },
  };
  diaExtra: boolean = false;
  esHorasExtra: boolean = false;
  esSalidaTemprana: boolean = false;
  esAtraso: boolean = false;
  esFalta: boolean = false;
  sinSalida: boolean;
  ruta: string = 'data';

  constructor(
    private router: Router,
    private justSvc: JustificationService,
    private modal: NgbModal,
    private authSvc: AuthService,
    private dataSvc: DataService
  ) {
    super();
    //obtiene los argumentos que se han enviado (desde el componente 'data')
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.value;
    //this.isAdmin = currentUser;
    if (!this.data.asistencia) {
      this.dataSvc.getDataJustification(this.data.idRegistro);
      this.data$ = this.dataSvc.dataById$.subscribe((data) => {
        this.data = data[0];
        this.ruta = 'justific';
        this.getTypeJustification();
        this.setJustification();
      });
    } else {
      this.getTypeJustification();
      this.setJustification();
    }
    this.getAdmin();
    this.getData();
  }
  ngOnDestroy(): void {
    try {
      this.dataSvc.dataById$ = null;
      this.data$.unsubscribe();
      this.just$.unsubscribe();
    } catch (error) {}
  }

  getData() {
    this.justSvc.getJustId(this.data.idUsuario);
    this.just$ = this.justSvc.justificationById$.subscribe((data) => {
      this.just = data;
      this.getTypeJustification();
      this.setJustification();
    });
  }
  async ngOnInit() {
    //verifica si contiene una justificación para visualizar detalles
    //caso contrario regresa a la vista de los "data".
    if (typeof this.data == 'undefined') {
      this.router.navigate([this.ruta]);
    } else {
    }
  }

  //función que se ejecuta cuando se da click en "atrás"
  goBack(): void {
    this.router.navigate([this.ruta]);
  }
  goOnEditJustification(): void {
    //toma el valor del item en el cual se dió click
    this.navigationExtras.state.value = this.data;
    //se redirige al componente "new-j" con el argumento que contiene el registro
    this.router.navigate(['new-j'], this.navigationExtras);
  }

  onClick(contenido: any, item: Justification) {
    this.justification = item;
    if (this.justification.status != 'ACEPTADO') {
      this.tipo = item.tipo;
      this.getTimeJustification(item);
    }
    this.modal.open(contenido, { size: 'lg' });
  }

  getTimeJustification(item: Justification) {
    if (item.tipo == 'FALTA') {
      this.mensaje = 'JUSTIFICACIÓN POR FALTA';
      this.tiempo = '00:00';
    } else if (item.tipo == 'SIN_SALIDA') {
      this.mensaje = 'JUSTIFICACIÓN POR NO GENERAR SALIDA';
      this.tiempo = '00:00';
    } else if (item.tipo == 'ATRASO') {
      this.mensaje = 'JUSTIFICACIÓN POR ATRASO';
      this.tiempo =
        ('0' + item.horaJustificada.split(':')[0]).substr(-2) +
        ':' +
        item.horaJustificada.split(':')[1];
    } else if (item.tipo == 'SALIDA_TEMPR') {
      this.mensaje = 'JUSTIFICACIÓN POR SALIDA TEMPRANA';
      this.tiempo =
        ('0' + item.horaJustificada.split(':')[0]).substr(-2) +
        ':' +
        item.horaJustificada.split(':')[1];
    } else if (item.tipo == 'HORAS_EXTRA') {
      this.mensaje = 'JUSTIFICACIÓN POR HORAS EXTRA';
      this.tiempo =
        ('0' + item.horaJustificada.split(':')[0]).substr(-2) +
        ':' +
        item.horaJustificada.split(':')[1];
    }
  }

  print(contenido: any) {
    this.justification.motivoR = '';
    this.onAccept(this.justification, this.tiempo, this.flag);
    this.modal.dismissAll(contenido);
  }
  //en el caso de que se de click en el botón "Aceptar"
  //su status cambiará a ACEPTADO
  onAccept(item: Justification, horaE: String, flag: boolean) {
    try {
      this.justSvc.onAccept(item, horaE, flag);
    } catch (error) {}
  }

  //en el caso de que se de click en el botón "Rechazar"
  //su status cambiará a RECHAZADO
  onReject() {
    try {
      this.modal.dismissAll();
      this.justification.motivoR = this.motivoR;
      this.justSvc.onReject(this.justification);
    } catch (error) {}
  }

  getAdmin() {
    //se obtiene el usuario autenticado mediante una suscripción al observable del servicio authService
    this.authSvc.currentUser$.subscribe((data) => {
      //asignación del usuario autenticado a "currentUser".
      this.currentUser = data[0].name;
      this.currentUserId = data[0].uid;
      //comprobación del rol del usuario autenticado mediante la funcion isAdmin
      //definida en la clase RoleValidator
      this.isAdmin = this.authSvc.isAdmin(data);
    });
  }

  getTypeJustification() {
    if (this.data.asistencia) {
      if (
        this.data.asistencia[2] == 'SALIDA TEMPRANA' ||
        this.data.asistencia[1] == 'SALIDA TEMPRANA'
      ) {
        this.esSalidaTemprana = true;
      }

      if (this.data.hora[1]) {
        if (this.data.asistencia[1] == 'SIN SALIDA') {
          this.sinSalida = true;
        }
      }
      if (this.data.asistencia[0] == 'FALTA') {
        this.esFalta = true;
      }
      //se selecciona el value del Radiobutton por defecto en 2
      if (this.data.horasExtra != '00:00:00' && this.data.horasExtra) {
        this.esHorasExtra = true;
      }

      if (this.data.asistencia[0] == 'ATRASO') {
        this.esAtraso = true;
      }
      if (this.data.asistencia[0] == 'DIA EXTRA') {
        this.diaExtra = true;
      }
    }
  }
  setJustification() {
    if (this.data.justificaciones) {
      this.data.justificaciones.forEach((just) => {
        if (just.indexOf('DIA_EXTRA') > 0) this.diaExtra = false;
        if (just.indexOf('SIN_SALIDA') > 0) this.sinSalida = false;
        if (just.indexOf('FALTA') > 0) this.esFalta = false;
        if (just.indexOf('ATRASO') > 0) this.esAtraso = false;
        if (just.indexOf('SALIDA_TEMPR') > 0) this.esSalidaTemprana = false;
        if (just.indexOf('HORAS_EXTRA') > 0) this.esHorasExtra = false;
      });
    }
  }
}
