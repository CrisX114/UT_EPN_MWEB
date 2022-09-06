export type asistencia =
  | 'PRESENTE'
  | 'ATRASO'
  | 'FALTA'
  | 'SALIDA TEMPRANA'
  | 'SIN SALIDA'
  | 'DIA EXTRA';

export interface Data {
  id: string;
  usuario: string;
  idUsuario: string;
  asistencia: asistencia[];
  hora: string[];
  horasExtra?: string;
  horasTrabajadas?: string;
  temperatura?: string[];
  justificaciones?: string[];
  horasDeTrabajo: string;
}
