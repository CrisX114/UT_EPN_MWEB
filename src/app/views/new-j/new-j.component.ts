import { Data } from '../../models/data.interface';
import { JustificationService } from '../../components/services/justification.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimeConverter } from '../../components/class/time-converter';
import { FilesService } from '../../components/services/files.service';

@Component({
  selector: 'app-new-j',
  templateUrl: './new-j.component.html',
  styleUrls: ['./new-j.component.css'],
})
export class NewJComponent extends TimeConverter implements OnInit {
  //almacenará el registro (tipo Data) que va a ser justificado
  //llega como argumento de entrada desde el componente "Data"
  data: Data = null;
  //formulario que contiene los datos de la justificación
  justForm: FormGroup;
  //variable que almacenará el value del RadioButton
  //1: justificación por asistencia || 2: justificación Horas Extra
  esAtraso: boolean = false;
  esFalta: boolean = false;
  esSalidaTemprana: boolean = false;
  esHorasExtra: boolean = false;
  sinHoraSalida: boolean = false;
  esDiaExtra: boolean = false;
  tipoJust: string;
  sinSalida: boolean;

  url: string = '';
  pathFile: string = '';
  file: File = null;
  message: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private justSvc: JustificationService,
    private modal: NgbModal,
    private storage: FilesService
  ) {
    super();
    //se guarda en data el registro que va a ser justificado(en caso de que exista)
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.value;
    //se crea el objeto formulario.
    this.initForm();
  }

  ngOnInit(): void {
    //verifica si contiene un registro que justificar
    //si no existe registro, regresa a la vista de "data".
    //caso contrario, se usan los datos de registro para seleccionar el Radiobutton y
    //llenar el objeto del formulario.
    if (typeof this.data === 'undefined') {
      this.router.navigate(['/data']);
    } else {
      this.getTypeJustification();
      this.setJustification();
      this.justForm.patchValue({
        fecha: this.data.hora[0],
        idUsuario: this.data.idUsuario,
        idRegistro: this.data.id,
      });
    }
  }

  selectFile($event: any) {
    this.file = $event.target.files[0];
    this.pathFile = 'justificaciones/' + this.file.name;
  }

  async uploadFile() {
    if (this.pathFile != '') {
      this.url = await this.storage.uploadFile(this.pathFile, this.file);
    }
  }

  noUploadFile() {
    this.justForm.patchValue({ urlLink: null });
    this.pathFile = '';
    this.file = null;
  }

  openConfirm(confirm: any) {
    this.modal.open(confirm, { size: 'lg' });
  }

  //Función que se ejecuta cuando se da click en "Aceptar"
  //se valida el formulario y se guarda la justificación en Cloud Firebase
  onSave(ad: any): void {
    const justificacion = this.justForm.value;
    this.justForm.patchValue({
      horaJustificada: this.setHorasJustificadas(justificacion),
      urlLink: this.url,
    });
    if (this.justForm.valid) {
      const justificacion = this.justForm.value;
      this.justSvc.onSaveJustification(justificacion, this.data);
      this.justForm.reset();
      this.modal.dismissAll();
      this.message = 'Justificación creada correctamente!';
      this.modal.open(ad, { size: 'lg' });
      this.router.navigate(['/data']);
    } else {
      this.message = 'Error al ingresar los datos, intente nuevamente';
      this.modal.open(ad, { size: 'lg' });
    }
  }
  //Función que se ejecuta cuando se da click en "Atrás"
  onGoBackToList(): void {
    this.router.navigate(['/data']);
  }

  setHorasJustificadas(item: any): string {
    if (item.tipo == 'FALTA' || item.tipo == 'SIN_SALIDA') {
      return '00:00:00';
    } else if (
      item.tipo == 'ATRASO' ||
      item.tipo == 'SALIDA_TEMPR' ||
      item.tipo == 'DIA_EXTRA'
    ) {
      return this.data.horasTrabajadas;
    } else if (item.tipo == 'HORAS_EXTRA') {
      return this.data.horasExtra;
    }
  }

  getTypeJustification() {
    if (this.data.asistencia.filter((n) => n == 'SALIDA TEMPRANA').length > 0) {
      this.esSalidaTemprana = true;
    }
    if (this.data.asistencia.filter((n) => n == 'SIN SALIDA').length > 0) {
      this.sinSalida = true;
    }
    if (this.data.asistencia.filter((n) => n == 'FALTA').length > 0) {
      this.esFalta = true;
    }
    if (this.data.asistencia.filter((n) => n == 'ATRASO').length > 0) {
      this.esAtraso = true;
    }
    if (this.data.horasExtra != '00:00:00') {
      this.esHorasExtra = true;
    }
    if (this.data.asistencia.filter((n) => n == 'DIA EXTRA').length > 0) {
      this.esDiaExtra = true;
      this.esHorasExtra = false;
    }
  }

  setJustification() {
    if (this.data.justificaciones) {
      this.data.justificaciones.forEach((just) => {
        if (just.indexOf('SIN_SALIDA') > 0) this.sinSalida = false;
        if (just.indexOf('FALTA') > 0) this.esFalta = false;
        if (just.indexOf('ATRASO') > 0) this.esAtraso = false;
        if (just.indexOf('SALIDA_TEMPR') > 0) this.esSalidaTemprana = false;
        if (just.indexOf('HORAS_EXTRA') > 0) this.esHorasExtra = false;
      });
    }
  }

  //función para instanciar las claves:valor del formulario.
  private initForm(): void {
    this.justForm = this.fb.group({
      mensaje: ['', [Validators.required]],
      fecha: [null, [Validators.required]],
      tipo: ['', [Validators.required]],
      urlLink: [null],
      status: ['SOLICITADO', [Validators.required]],
      idUsuario: ['', [Validators.required]],
      idRegistro: ['', [Validators.required]],
      horaJustificada: [''],
    });
  }

  get fecha() {
    return this.justForm.get('fecha');
  }

  get urlLink() {
    return this.justForm.get('urlLink');
  }
}
