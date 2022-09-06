import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/components/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> {
    //compara si en el servicio authService existe un usuario loggeado
    //en el caso de que existe, se redirige a la ruta de data y retorna false
    //caso contrario, devuelve true y el componente carga la vista correspondiente.
    return this.authSvc.userDataFirebase$.pipe(
      map((user) => {
        if (user) {
          this.router.navigate(['/data']);
          return false;
        }
        return true;
      })
    );
  }
}
