import { Data } from './data.interface';

export interface DataMes {
  usuario: string;
  idUsuario: string;
  fecha: string;
  data: Data[];
  horasTrabajadas: string;
  horasTotalesTrabajo: string;
  horasExtra: string;
  horasExtraJustificadas: string;
  horasDiaExtra: string;
  numAtrasos: number;
  numFaltas: number;
  numSalidasTempranas: number;
  numDiaExtra: number;
  numSinSalidas: number;
}
