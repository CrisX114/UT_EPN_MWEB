import { Preference } from '../../models/preference.interface';
import { PreferenceService } from '../../components/services/preference.service';
import { User } from 'src/app/models/user.interface';
import { UserService } from '../../components/services/user.service';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  //objeto que contendrá al usuario visualizado
  user: User = null;
  preferences: Preference;
  //objeto que será recibido como argumento (contiene el usuario visualizado)
  navigationExtras: NavigationExtras = {
    state: {
      value: null,
    },
  };

  constructor(
    private router: Router,
    private userSvc: UserService,
    private preferenceSvc: PreferenceService,
    private modal: NgbModal
  ) {
    //se guarda en user el usuario a visualizar (en caso de que exista)
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras?.state?.value;
    this.preferenceSvc.preference$.subscribe(
      (pref) => (this.preferences = pref)
    );
  }
  ngOnInit(): void {
    //verifica si contiene un usuario para visualizar detalles
    //caso contrario regresa a la vista de los usuarios.
    if (typeof this.user === 'undefined') {
      this.router.navigate(['g-users']);
    }
  }

  //función que se ejecuta cuando se da click en "editar".
  onGoToEdit(): void {
    //envia los datos del usuario visualizado hacia la ruta "edit-user"
    this.navigationExtras.state.value = this.user;
    this.router.navigate(['edit-user'], this.navigationExtras);
  }

  //función que se ejecuta cuando se da click en "Borrar".
  async onGoToDelete(): Promise<void> {
    try {
      if (this.user.idHuella) {
        this.preferences.idHuellaAccion = this.user.idHuella;
        this.preferences.puedeEliminar = true;
      } else {
        this.preferences.puedeCrear = false;
      }
      this.preferenceSvc.onSavePreference(this.preferences);
      await this.userSvc.onDeleteUser(this.user?.uid);
      alert('Eliminado');
      this.modal.dismissAll();
      this.onGoBackToList();
    } catch (err) {}
  }

  //función que se ejecuta cuando se da click en "Atrás".
  onGoBackToList(): void {
    this.router.navigate(['g-users']);
  }
  openModal(contentsDelete: any) {
    this.modal.open(contentsDelete, { size: 'lg' });
  }
}
