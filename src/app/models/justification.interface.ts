export type tipo =
  | 'ATRASO'
  | 'FALTA'
  | 'HORAS_EXTRA'
  | 'SALIDA_TEMPR'
  | 'SIN_SALIDA'
  | 'DIA_EXTRA';

export type status = 'ACEPTADO' | 'RECHAZADO' | 'SOLICITADO';

export interface Justification {
  id: string;
  tipo: tipo;
  mensaje: string;
  status: status;
  idUsuario: string;
  idRegistro: string;
  usuario: string;
  fecha: any;
  horaJustificada?: string;
  urlLink?: string;
}
