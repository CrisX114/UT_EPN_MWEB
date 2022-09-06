export interface Preference {
  toleranciaIn: number;
  toleranciaOut: number;
  horaRegistroFaltas: number;
  numeroDeHuellasRegistradas: number;
  puedeCrear: boolean;
  puedeActualizar: boolean;
  puedeEliminar: boolean;
  puedeActualizarUsuarios: boolean;
  idHuellaAccion: number;
  timeServer: string;
  emailAdmin: string;
}
