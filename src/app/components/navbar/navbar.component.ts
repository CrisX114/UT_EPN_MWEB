import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService],
})
export class NavbarComponent implements OnInit {
  //variable que indica si existe un usuario loggeado o no
  public isLogged = false;
  public isAdmin: boolean = false;
  //objeto que tendrá datos del usuario obtenido en el servicio authService
  public currentUser: string;
  public currentUserEmail: string;

  constructor(private authSvc: AuthService, private router: Router) {}
  async ngOnInit() {
    //función que comprueba si existe un usuario loggeado,
    //en el caso de que exista, el estado de isLogged cambiará a true
    //caso contrario, se mantendrá en false y se redirige a la ruta login

    this.getUser();
  }
  getUser() {
    //se obtiene el usuario autenticado mediante una suscripción al observable del servicio authService
    this.authSvc.currentUser$.subscribe((data) => {
      try {
        if (data.toString()) {
          //asignación del usuario autenticado a "currentUser".
          this.currentUser = data[0].name;
          this.currentUserEmail = data[0].email;
          this.isAdmin = this.authSvc.isAdmin(data);
          //definida en la clase RoleValidator
          this.isLogged = true;
        } else {
          this.authSvc.logout();
          window.alert('ERROR EN INICIO DE SESION, INTENTE DE NUEVO');
        }
      } catch (error) {}
    });
  }

  async onLogout() {
    //funcion que se ejecuta cuando se presiona el botón "Cerrar Sesión"
    try {
      this.router.navigate(['/login']);
      this.authSvc.logout();
    } catch (error) {}
  }
}
