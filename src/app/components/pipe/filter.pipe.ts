import { Data } from '../../models/data.interface';
import { Pipe, PipeTransform } from '@angular/core';
import { TimeConverter } from '../class/time-converter';

@Pipe({
  name: 'filter',
})
export class FilterPipe extends TimeConverter implements PipeTransform {
  //objeto donde se guardará toda la data (value)
  public data: any = [];
  constructor() {
    super();
  }
  //función para filtrar
  transform(value: any, args: any): any {
    //en el caso de que se escriba menos de 2 caracteres se retornará value (todos los resultados)
    if (args.length < 2) return value;
    //caso contrario se asigna el valor de value a data para acceder a su propiedad foreach()
    this.data = value;
    //se define un array que contendrá todos los resultados que coincidan
    const resultData = [];
    this.data.forEach((item: Data) => {
      //mediante el foreach se analiza cada item
      //se analiza el usuario, la fecha y la asistencia(si existe)
      if (
        item.usuario.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        this.timeConverter(item.hora[0]['seconds'], 1).indexOf(args) > -1 ||
        item.asistencia[0].toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        item.asistencia[1]?.toLowerCase().indexOf(args.toLowerCase()) > -1
      ) {
        //si encuentra coinciencia, se agrega al array definido
        resultData.push(item);
      }
    });
    //si el array de resultados contiene items, se lo retorna
    if (resultData.length > 0) return resultData;
    //caso contrario se retorna null.
    return null;
  }
}
