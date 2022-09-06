import { Pipe, PipeTransform } from '@angular/core';
import { TimeConverter } from '../class/time-converter';

@Pipe({
  name: 'filterDate',
})
export class FilterDatePipe extends TimeConverter implements PipeTransform {
  public data: any = [];
  constructor() {
    super();
  }
  transform(value: any, args: any): any {
    //en el caso de que se escriba menos de 2 caracteres se retornará value (todos los resultados)
    if (args.length < 2) return value;
    //caso contrario se asigna el valor de value a data para acceder a su propiedad foreach()
    this.data = value;
    //se define un array que contendrá todos los resultados que coincidan
    const resultData = [];
    this.data?.forEach((item: any) => {
      //mediante el foreach se analiza cada item
      //se analiza el usuario, la fecha y la asistencia(si existe)
      if (item.fecha) {
        if (this.timeConverter(item.fecha['seconds'], 1)?.includes(args)) {
          //si encuentra coinciencia, se agrega al array definido
          resultData.push(item);
        }
        if (item.fecha?.includes(args)) {
          //si encuentra coinciencia, se agrega al array definido
          resultData.push(item);
        }
      }
      //verifica si existe la variable hora (array).
      if (item.hora) {
        //Si existe la variable, analiza el campo fecha de hora
        if (this.timeConverter(item.hora[0]['seconds'], 1)?.includes(args)) {
          //si encuentra coinciencia, se agrega al array definido
          resultData.push(item);
        }
      }
    });
    //si el array de resultados contiene items, se lo retorna
    if (resultData.length > 0) return resultData;
    //caso contrario se retorna null.
    return null;
  }
}
