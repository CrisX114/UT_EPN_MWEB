export type Roles = 'EMPLEADO' | 'ADMINISTRADOR';

export interface User {
  uid: string;
  email: string;
  role: Roles;
  name: string;
  descr?: string;
  horaIn: string;
  horasDeTrabajo: string;
  idHuella?: number;
}
