import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}
  //función que se ejecuta antes de cargar la vista del componente
  canActivate(): Observable<boolean> {
    //compara si en el servicio authService existe un usuario loggeado
    //y si el usuario se envia a la funcion isAdmin definida en RoleValidator.ts
    //si el usuario es Admin devolverá true y el componente carga la vista correspondiente
    //en caso contrario retornará false, se mostrará un mensaje de acceso denegado.
    //y se redirige a la ruta de 'data' (única ruta que tiene acceso un usuario EMPLEADO)
    return this.authSvc.currentUser$.pipe(
      map((user) => {
        if (this.authSvc.isAdmin(user)) {
          return true;
        }
        if (this.authSvc.isEmpl(user)) {
          this.router.navigate(['data']);
        }
        return false;
      })
    );
  }
}
