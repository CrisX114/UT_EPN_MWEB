import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUser',
})
export class FilterUserPipe implements PipeTransform {
  //objeto donde se guardará toda la data (value)
  public data: any = [];
  transform(value: any, args: any): any {
    //en el caso de que se escriba menos de 2 caracteres se retornará value (todos los resultados)
    if (args.length < 2) return value;
    //caso contrario se asigna el valor de value a data para acceder a su propiedad foreach()
    this.data = value;
    //se define un array que contendrá todos los resultados que coincidan
    const resultData = [];
    this.data.forEach((item: any) => {
      //mediante el foreach se obtiene cada item y se analiza el nombre de usuario
      if (
        item.usuario?.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        item.name?.toLowerCase().indexOf(args.toLowerCase()) > -1
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
