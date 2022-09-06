import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/user.interface';
import { UserService } from '../../components/services/user.service';
import { NavigationExtras, Router } from '@angular/router';
import { Component } from '@angular/core';
import { PreferenceService } from '../../components/services/preference.service';
import { Preference } from '../../models/preference.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-g-users',
  templateUrl: './g-users.component.html',
  styleUrls: ['./g-users.component.css'],
})
export class GUsuariosComponent {
  //objeto observable que contiene los datos de usuarios desde el
  //servicio userService.

  //se almacenarán los usuarios registrados en el sistema
  user: User[];
  user$: Subscription;
  //objeto que enviará los datos del usuario como argumento
  navigationExtras: NavigationExtras = { state: { value: null } };
  preferences: Preference;
  userDelete: User;

  constructor(
    private router: Router,
    private userSvc: UserService,
    private preferenceSvc: PreferenceService,
    private modal: NgbModal
  ) {
    this.userSvc.getUsers();
    this.user$ = this.userSvc.user$.subscribe((data) => (this.user = data));
    this.preferenceSvc.preference$.subscribe(
      (pref) => (this.preferences = pref)
    );
  }

  //función que se ejecuta cuando se da click en "editar"
  //envia los datos del usuario como argumentos en el router
  onGoToEdit(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['edit-user'], this.navigationExtras);
  }
  //función que se ejecuta cuando se da click en "detalles"
  //envia los datos del usuario como argumentos en el router
  onGoToSee(item: any): void {
    this.navigationExtras.state.value = item;
    this.router.navigate(['details'], this.navigationExtras);
  }
  //función que se ejecuta cuando se da click en "borrar"
  //se envia, al servicio userService, el id del usuario a borrar
  onGoToDelete(): void {
    this.userSvc.onDeleteUser(this.userDelete.uid);
    this.preferences.puedeEliminar = true;
    this.preferences.idHuellaAccion = this.userDelete.idHuella;
    this.userDelete = null;
  }
  onGoToNew(): void {
    this.router.navigate(['new']);
  }

  onClickModal(contents: any, user: User) {
    this.modal.open(contents, { size: 'lg' });
    this.userDelete = user;
  }
}
