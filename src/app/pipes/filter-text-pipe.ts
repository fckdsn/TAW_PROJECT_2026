import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterTextPipe implements PipeTransform {

  transform(value: any[], filterText: any): any {
    if (!value) {
      return [];
    }
    if (!filterText) {
      return value;
    }

    const text = filterText.toLowerCase();

    return value.filter(val => {
      return (
        (val.text && val.text.toLowerCase().includes(text)) ||
        (val.title && val.title.toLowerCase().includes(text))
      );
    });
  }
}
