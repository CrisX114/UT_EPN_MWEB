import { Justification } from '../../models/justification.interface';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCard',
})
export class FilterCardPipe implements PipeTransform {
  //objeto donde se guardará toda los datos de justificaciones (value)
  public just: any = [];
  //función para filtrar
  transform(value: any, args: any): any {
    //en el caso de que se escriba menos de 2 caracteres se retornará value (todos los resultados)
    if (args.length < 2) return value;
    //caso contrario se asigna el valor de value a data para acceder a su propiedad foreach()
    this.just = value;
    //se define un array que contendrá todos los resultados que coincidan
    const resultJust = [];
    this.just.forEach((item: Justification) => {
      //mediante el foreach se analiza cada item se analiza el usuario, la fecha y el status
      if (
        item.usuario.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        item.tipo.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        item.status.toLowerCase().indexOf(args.toLowerCase()) > -1
      ) {
        //si encuentra coinciencia, se agrega al array definido
        resultJust.push(item);
      }
    });
    //si el array de resultados contiene items, se lo retorna, caso contrario se retorna null.
    if (resultJust.length > 0) return resultJust;
    return null;
  }
}
