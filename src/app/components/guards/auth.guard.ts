import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/components/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}
  //función que se ejecuta antes de cargar la vista del componente
  canActivate(): Observable<boolean> {
    //compara si en el servicio authService existe un usuario loggeado
    //en el caso de que no existe, se redirige a la ruta de login y retorna false
    //de lo contrario, devuelve true y el componente carga la vista correspondiente.
    return this.authSvc.userDataFirebase$.pipe(
      map((user) => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
