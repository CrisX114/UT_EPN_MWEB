import { User } from 'src/app/models/user.interface';

export class RoleValidator {
  //función que devuelve true si el rol del usuario es EMPLEADO
  isEmpl(user: User): boolean {
    return user[0].role === 'EMPLEADO';
  }

  //función que devuelve true si el rol del usuario es ADMIN
  isAdmin(user: User): boolean {
    return user[0].role === 'ADMINISTRADOR';
  }
}
