import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  standalone: true
})
export class PaginatePipe implements PipeTransform {

  transform(items: any[], page: number, perPage: number): any[] {
    if (!items || items.length === 0) return [];
    const currentPage = page || 1;
    const limit = perPage || items.length;
    const start = (currentPage - 1) * limit;
    return items.slice(start, start + limit);
  }
}
