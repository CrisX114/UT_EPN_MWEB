import { AuthService } from 'src/app/components/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { PreferenceService } from '../../components/services/preference.service';
import { Preference } from '../../models/preference.interface';
import { TimeConverter } from '../../components/class/time-converter';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css'],
})
export class PreferencesComponent extends TimeConverter {
  private isEmail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private isNumber = /^([0-9])*$/;

  isAdmin: boolean = false;
  editar: boolean = false;
  preferences: Preference;
  prefForm: FormGroup;
  generateEmailPasswordForm: FormGroup;
  changePasswordForm: FormGroup;
  message: string;

  constructor(
    private prefSvc: PreferenceService,
    private fb: FormBuilder,
    private modal: NgbModal,
    private authSvc: AuthService
  ) {
    super();
    this.prefSvc.preference$.subscribe((pref) => (this.preferences = pref));
    this.initForm();
    this.authSvc.currentUser$.subscribe((data) => {
      if (data.toString()) {
        //comprobación del rol del usuario autenticado mediante la funcion isAdmin
        //definida en la clase RoleValidator
        this.isAdmin = this.authSvc.isAdmin(data);
      }
    });
  }

  onEdit(): void {
    this.editar = true;
    const hora = this.convertString(this.preferences.horaRegistroFaltas);
    this.prefForm.patchValue(this.preferences);
    this.prefForm.patchValue({ horaRegistroFaltas: hora });
  }

  cancelAct(ad: any): void {
    this.preferences.idHuellaAccion = 0;
    this.preferences.puedeActualizar = false;
    this.prefSvc.onSavePreference(this.preferences);
    this.message = 'Se actualizaron los datos de preferencias';
    this.prefForm.reset();
    this.editar = false;
    this.modal.open(ad, { size: 'lg' });
  }

  onSave(ad: any): void {
    if (this.prefForm.valid) {
      this.message = 'Datos actualizados correctamente';
      const pref = this.prefForm.value;
      pref.horaRegistroFaltas = this.convertNumber(pref.horaRegistroFaltas);
      this.prefSvc.onSavePreference(pref);
      this.prefForm.reset();
      this.editar = false;
      this.modal.open(ad, { size: 'lg' });
    } else {
      this.message = 'Error en ingresar los datos';
      this.modal.open(ad, { size: 'lg' });
    }
  }

  onClickActivate(modal: any): void {
    try {
      this.initFormPassword();
      this.initFormChangePassword();
      this.modal.dismissAll();
      this.modal.open(modal, { size: 'lg' });
    } catch (error) {}
  }

  onChangePassword(ad: any) {
    try {
      if (this.changePasswordForm.valid) {
        const { pass1 } = this.changePasswordForm.value;
        this.authSvc.onChangePassword(pass1);
        this.modal.dismissAll();
        this.message = 'Contraseña cambiada correctamente. Se cerrará sesión.';
        this.modal.open(ad, { size: 'lg' });
        this.authSvc.logout();
      }
    } catch (error) {}
  }

  onActivate(ad: any): void {
    try {
      if (this.generateEmailPasswordForm.valid) {
        const { email, password } = this.generateEmailPasswordForm.value;
        this.modal.dismissAll();
        this.authSvc.register(email, password);
        this.generateEmailPasswordForm.reset();
        this.editar = false;
        this.message = 'Cuenta activada correctamente. Se cerrará sesión.';
        this.modal.open(ad, { size: 'lg' });
        this.authSvc.logout();
      } else {
        this.message = 'Error en ingresar los datos';
        this.modal.open(ad, { size: 'lg' });
      }
    } catch (error) {}
  }

  goBack(): void {
    this.editar = !this.editar;
  }

  private initForm(): void {
    this.prefForm = this.fb.group({
      horaRegistroFaltas: ['', [Validators.required]],
      toleranciaIn: [
        '',
        [Validators.required, Validators.pattern(this.isNumber)],
      ],
      toleranciaOut: [
        '',
        [Validators.required, Validators.pattern(this.isNumber)],
      ],
    });
  }
  private initFormPassword(): void {
    this.generateEmailPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private initFormChangePassword(): void {
    this.changePasswordForm = this.fb.group({
      pass1: ['', [Validators.required, Validators.minLength(6)]],
      pass2: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get pass1() {
    return this.changePasswordForm.get('pass1');
  }
  get pass2() {
    return this.changePasswordForm.get('pass2');
  }

  get horaRegistroFaltas() {
    return this.prefForm.get('horaRegistroFaltas');
  }
  get toleranciaIn() {
    return this.prefForm.get('toleranciaIn');
  }
  get toleranciaOut() {
    return this.prefForm.get('toleranciaOut');
  }
  get email() {
    return this.generateEmailPasswordForm.get('email');
  }
  get password() {
    return this.generateEmailPasswordForm.get('password');
  }
}
