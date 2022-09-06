import { Pipe, PipeTransform } from '@angular/core';
import { DataMes } from '../../models/datames.interface';

@Pipe({
  name: 'filterDataMes',
})
export class FilterDataMesPipe implements PipeTransform {
  //objeto donde se guardará toda la data (value)
  public dataMes: any = [];

  //función para filtrar
  transform(value: any, args: any): any {
    //en el caso de que se escriba menos de 2 caracteres se retornará value (todos los resultados)
    if (args.length < 2) return value;
    //caso contrario se asigna el valor de value a data para acceder a su propiedad foreach()
    this.dataMes = value;
    //se define un array que contendrá todos los resultados que coincidan
    const resultData = [];
    this.dataMes.forEach((item: DataMes) => {
      //mediante el foreach se analiza cada item. Se analiza el usuario y la fecha
      if (
        item.usuario.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        item.fecha?.toLowerCase().indexOf(args.toLowerCase()) > -1
      ) {
        //si encuentra coinciencia, se agrega al array definido
        resultData.push(item);
      }
    });
    //si el array de resultados contiene items, se lo retorna. Caso contrario se retorna null.
    if (resultData.length > 0) return resultData;
    return null;
  }
}
