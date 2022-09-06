import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../components/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  //objeto que contendrá el resultado de la funcion login en el servicio
  //authService
  public currentUser: any;
  //formulario que contiene los datos de email y contraseña.
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  //instancia de servicio de autenticación y enrutamiento
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private modal: NgbModal
  ) {}

  //función que se ejecuta cuando se da click en el botón Login
  async onLogin(errorLogin: any) {
    const { email, password } = this.loginForm.value;
    if (email && password) {
      try {
        const user = await this.authSvc.login(email, password);
        if (user) {
          this.currentUser = user;
          this.router.navigate(['data']);
        } else {
          this.modal.open(errorLogin, { size: 'lg' });
        }
      } catch (error) {}
    }
  }
}
