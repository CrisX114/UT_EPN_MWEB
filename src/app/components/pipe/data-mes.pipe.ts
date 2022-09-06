import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataMes'
})
export class DataMesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
