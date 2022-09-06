import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterStatus',
})
export class FilterStatusPipe implements PipeTransform {
  //objeto donde se guardará toda los datos de justificaciones (value)
  public data: any = [];
  //función para filtrar
  transform(value: any, args: any): any {
    //en el caso de que se escriba menos de 2 caracteres se retornará value (todos los resultados)
    if (args.length < 2) return value;
    //caso contrario se asigna el valor de value a data para acceder a su propiedad foreach()
    this.data = value;
    //se define un array que contendrá todos los resultados que coincidan
    const dataResult = [];
    this.data?.forEach((item: any) => {
      //mediante el foreach se obtiene la informacion, se analiza el tipo, status y asistencia
      if (
        item.tipo?.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        item.status?.toLowerCase().indexOf(args.toLowerCase()) > -1
      ) {
        //si encuentra coinciencia, se agrega al array definido
        dataResult.push(item);
      }
      if (item.asistencia) {
        if (
          item.asistencia[0]?.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
          item.asistencia[1]?.toLowerCase().indexOf(args.toLowerCase()) > -1
        ) {
          dataResult.push(item);
        }
      }
    });
    //si el array de resultados contiene items, se lo retorna, caso contrario se retorna null.
    if (dataResult.length > 0) return dataResult;
    return [];
  }
}
