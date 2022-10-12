import { UserService } from '../../components/services/user.service';
import { Preference } from '../../models/preference.interface';
import { PreferenceService } from '../../components/services/preference.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/components/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
})
export class NewComponent implements OnInit {
  private isEmail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  ///S+@S+.S+/;
  private isHora = /^(([0-1]{0,1}[0-9])|(2[0-3])):[0-5]{0,1}[0-9]$/;
  private isName = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/;
  private message: String;

  user: User;
  usuarioGuardado: boolean = false;
  userForm: FormGroup;
  userFormPassword: FormGroup;
  actForm: FormGroup;
  emailUsuario: String;
  passwordUsuario: String;
  preferences: Preference;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private afReg: AuthService,
    private modal: NgbModal,
    private preferenceSvc: PreferenceService,
    private userSvc: UserService
  ) {
    this.preferenceSvc.preference$.subscribe(
      (pref) => (this.preferences = pref)
    );
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras?.state?.value;

    this.initForm();
  }

  ngOnInit(): void {}

  onSave(contents: any, ad: any): void {
    if (this.userForm.valid) {
      this.preferences.puedeCrear = true;
      this.preferenceSvc.onSavePreference(this.preferences);
      const user = this.userForm.value;
      this.emailUsuario = user.email;
      if (user.horario == 'Horario Flexible') {
        user.horaIn = '00:00';
        user.horasDeTrabajo = '00:00';
      }
      delete user.horario;
      const userId = null;
      this.userSvc.onSaveUser(user, userId);
      this.usuarioGuardado = true;
      this.onClick(contents);
    } else {
      this.message = 'Error en ingresar los datos';
      this.modal.open(ad, { size: 'lg' });
    }
  }

  onClick(contents: any) {
    try {
      this.initFormPassword();
      this.modal.dismissAll(contents);
      this.modal.open(contents, { size: 'lg' });
    } catch (error) {
      console.log(error);
    }
  }

  onActivate(contents: any): void {
    const { email } = this.userForm.value;
    const { password } = this.userFormPassword.value;
    this.afReg.register(email, password);
    this.afReg.logout();
    this.modal.dismissAll(contents);
    this.userForm.reset();
    this.router.navigate(['/login']);
  }

  onGoBackToList(): void {
    this.router.navigate(['g-users']);
  }

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
      role: ['EMPLEADO', [Validators.required]],
      horario: ['Horario Flexible', [Validators.required]],
      horaIn: ['07:00', [Validators.required, Validators.pattern(this.isHora)]],
      horasDeTrabajo: [
        '08:00',
        [Validators.required, Validators.pattern(this.isHora)],
      ],
    });
  }
  private initFormPassword(): void {
    this.userFormPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
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
  get password() {
    return this.userFormPassword.get('password');
  }
}
