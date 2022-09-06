import { Pipe, PipeTransform } from '@angular/core';
import { Data } from '../../models/data.interface';

@Pipe({
  name: 'pagination',
})
export class PaginationPipe implements PipeTransform {
  transform(data: Data[], page: number = 0): Data[] {
    if (data) {
      const filter = data.filter((item) => item.usuario);
      return filter.slice(page, page + 20);
    }
  }
}
