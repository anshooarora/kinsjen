import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textSearchFilter'
})
export class TextSearchFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, prop: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    if (!prop) {
      return items.filter(x => x.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
    }

    return items.filter(x => x[prop].toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
  }

}
