import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreferenceService } from '../../components/services/preference.service';
import { User } from 'src/app/models/user.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../components/services/user.service';
import { Preference } from '../../models/preference.interface';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  //variable definida para validar el correo electrónico
  private isEmail =
    /^([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;
  ///S+@S+.S+/;
  private isHora = /^(([0-1]{0,1}[0-9])|(2[0-3])):[0-5]{0,1}[0-9]$/;
  private isName = /^([A-Za-zÁÉÍÓÚáéíóúñÑ ]+)$/;
  private message;

  //usuario que contendrá el argumento recibido
  user: User;
  //formulario que contiene los datos que se pueden editar.
  userForm: FormGroup;

  preferences: Preference;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userSvc: UserService,
    private preferenceSvc: PreferenceService,
    private modal: NgbModal
  ) {
    //se guarda en user el usuario a editar (en caso de que exista)
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras?.state?.value;
    //se crea el objeto formulario.
    this.preferenceSvc.preference$.subscribe(
      (pref) => (this.preferences = pref)
    );
    this.initForm();
  }

  ngOnInit(): void {
    //verifica si contiene un usuario para editar
    //si no existe usuario, regresa a la vista de los usuarios.
    //caso contrario, se usan los datos de usuario para
    //llenar el objeto del formulario.
    if (typeof this.user === 'undefined') {
      this.router.navigate(['/g-users']);
    } else {
      this.userForm.patchValue(this.user);
    }
    if (this.user.horaIn != '00:00') {
      this.userForm.patchValue({ horario: 'Horario No Flexible' });
    }
  }

  //función que se ejecuta cuando se da click en "guardar"
  //se guarda los cambios en el usuario mediante el servicio
  //userService
  onSave(ad: any): void {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      const userId = this.user.uid;
      if (user.horario == 'Horario Flexible') {
        user.horaIn = '00:00';
        user.horasDeTrabajo = '00:00';
      }
      delete user.horario;
      this.userSvc.onUpdateUser(user, userId);
      this.preferences.puedeActualizarUsuarios = true;
      this.preferenceSvc.onSavePreference(this.preferences);
      this.message = 'Datos guardados correctamente';
      this.modal.open(ad, { size: 'lg' });
      this.userForm.reset();
      this.router.navigate(['/g-users']);
    } else {
      this.message = 'Error en ingresar los datos';
      this.modal.open(ad, { size: 'lg' });
    }
  }

  //función que se ejecuta cuando se da click en "Atrás"
  onGoBackToList(): void {
    this.router.navigate(['g-users']);
  }

  onClickModal(contenido: any) {
    this.modal.open(contenido, { size: 'lg' });
  }

  updateHuella(ad: any) {
    this.preferences.idHuellaAccion = this.user.idHuella;
    this.preferences.puedeActualizar = true;
    this.preferenceSvc.onSavePreference(this.preferences);
    this.router.navigate(['g-users']);
    this.modal.dismissAll();
    this.message = 'Datos guardados correctamente';
    this.modal.open(ad, { size: 'md' });
  }

  //función para instanciar las claves:valor del formulario.
  private initForm(): void {
    this.userForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(this.isName),
        ],
      ],
      descr: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      role: ['', [Validators.required]],
      horario: ['Horario Flexible', [Validators.required]],
      horaIn: ['', [Validators.required, Validators.pattern(this.isHora)]],
      horasDeTrabajo: [
        '',
        [Validators.required, Validators.pattern(this.isHora)],
      ],
    });
  }
  get name() {
    return this.userForm.get('name');
  }
  get email() {
    return this.userForm.get('email');
  }
  get descr() {
    return this.userForm.get('descr');
  }
  get horaIn() {
    return this.userForm.get('horaIn');
  }
  get horasDeTrabajo() {
    return this.userForm.get('horasDeTrabajo');
  }

  get horario() {
    return this.userForm.get('horario');
  }
}
