import { TimeConverter } from '../../components/class/time-converter';
import { Justification } from '../../models/justification.interface';
import { JustificationService } from '../../components/services/justification.service';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../components/services/auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-justific',
  templateUrl: './justific.component.html',
  styleUrls: ['./justific.component.css'],
})
export class JustificComponent extends TimeConverter {
  //variable iniciado en vacio
  //será usada para el filtro en la vista de justificaciones
  //se relaciona con el pipe filterCard
  filter1 = '';
  filter2 = '';
  filter3 = '';
  //se guarda una copia del observable en un objeto Justification[]
  justification: Justification[];
  just$: Subscription;
  just: Justification;
  hora: String;
  asistencia: string;
  tiempo: string;
  message: string;
  flag: boolean;
  isAdmin: boolean = false;
  selected: String = '';
  filterSelected: String = '';

  //variable que recupera el usuario autenticado desde el servicio authService
  currentUser: string = null;
  currentUserId: string = null;

  //objeto para almacenar los registros que se desea enviar a otro componente
  navigationExtras: NavigationExtras = { state: { value: null } };

  constructor(
    private router: Router,
    private justSvc: JustificationService,
    private modal: NgbModal,
    private authSvc: AuthService
  ) {
    super();
    //se obtiene una copia del observable a un objeto Justification[]
    this.justSvc.getJustifications();
    this.getDataAdmin();
    this.getAdmin();
  }

  async getDataAdmin() {
    //se obtiene el usuario autenticado mediante una suscripción al observable del servicio authService
    this.authSvc.currentUser$.subscribe((data) => {
      if (data.toString()) {
        //asignación del usuario autenticado a "currentUser".
        this.currentUser = data[0].name;
        this.currentUserId = data[0].uid;
        //comprobación del rol del usuario autenticado mediante la funcion isAdmin
        //definida en la clase RoleValidator
        this.isAdmin = this.authSvc.isAdmin(data);
      }
      //se obtiene una copia del observable de los registros a un objeto Data[]
      if (this.isAdmin) {
        //se obtiene una copia del observable de los usuarios a un objeto User[]
        this.justSvc.getJustifications();
        //se obtiene una copia del observable de las justificaciones a un objeto Justification[]
        this.just$ = this.justSvc.justification$.subscribe((data) => {
          this.justification = data;
        });
      } else {
        this.justSvc.getJustId(this.currentUserId);
        this.just$ = this.justSvc.justificationById$.subscribe(
          (data) => (this.justification = data)
        );
      }
    });
  }

  onClick(setHours: any, ad: any, item: Justification) {
    this.asistencia = item.tipo;
    if (item.tipo == 'ATRASO') {
      this.onAccept(item, '00:00', false);
      this.message = 'Datos guardados correctamente!';
      this.modal.open(ad, { size: 'lg' });
      return;
    }
    if (item.tipo == 'HORAS_EXTRA') {
      this.message = 'JUSTIFICACIÓN POR HORAS EXTRA';
      this.flag = true;
    } else {
      this.flag = false;
    }
    if (item.tipo == 'FALTA') {
      this.message = 'JUSTIFICACIÓN POR FALTA';
    }
    if (item.tipo == 'SALIDA_TEMPR') {
      this.message = 'JUSTIFICACIÓN POR SALIDA TEMPRANA';
    }
    if (item.tipo == 'SIN_SALIDA') {
      this.message = 'JUSTIFICACIÓN POR NO GENERAR SALIDA';
    }
    if (item.horaJustificada) {
      this.hora = item.horaJustificada;
      this.tiempo =
        ('0' + this.hora.split(':')[0]).substr(-2) +
        ':' +
        this.hora.split(':')[1];
    } else {
      this.tiempo = '00:00';
    }
    this.just = item;
    this.modal.open(setHours, { size: 'lg' });
  }

  seeData(item: any) {
    this.navigationExtras.state.value = item;
    //se redirige al componente "details-j" con el argumento que contiene el registro
    this.router.navigate(['details-j'], this.navigationExtras);
  }

  onClickModal(setHours: any) {
    this.modal.open(setHours, { size: 'lg' });
  }

  onClickModalAccept(ad: any) {
    this.onAccept(this.just, this.tiempo, this.flag);
    this.modal.dismissAll();
    this.message = 'Datos guardados correctamente!';
    this.modal.open(ad, { size: 'lg' });
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
  onReject(item: Justification, ad: any) {
    try {
      this.modal.dismissAll();
      this.justSvc.onReject(item);
      this.message = 'Datos guardados correctamente!';
      this.modal.open(ad, { size: 'lg' });
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
}
