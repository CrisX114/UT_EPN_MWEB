import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/components/services/auth.service';

@Component({
  selector: 'app-r-password',
  templateUrl: './r-password.component.html',
  styleUrls: ['./r-password.component.css'],
})
export class RPasswordComponent {
  private isEmail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private message: String;
  //formulario que contiene el dato del usuario
  userEmail = new FormControl('', [
    Validators.required,
    Validators.pattern(this.isEmail),
  ]);
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private modal: NgbModal
  ) {}

  //función que envía un correo electrónico de recuperación de contraseña
  //mediante el servicio authService
  async onReset(ad: any) {
    if (this.userEmail.valid) {
      try {
        const email = this.userEmail.value;
        await this.authSvc.resetPassword(email);
        this.modal.open(confirm, { size: 'lg' });
        this.router.navigate(['/login']);
        this.message =
          'Se ha enviado un mensaje de recuperación a su correo. Revise su Bandeja De Entrada. En el caso de no encontrar el correo revise sus Correos No Deseados';
        this.modal.open(ad, { size: 'lg' });
      } catch (error) {}
    } else {
      this.message = 'Ingresar correctamente los datos';
      this.modal.open(ad, { size: 'lg' });
    }
  }
  //función que se ejecuta cuando se da click en el botón atras
  goBack() {
    this.router.navigate(['/login']);
  }
}
