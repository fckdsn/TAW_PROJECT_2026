import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss']
})
export class PaginationComponent implements OnChanges {

  @Input() totalItems = 0;
  @Input() itemsPerPage = 5;
  @Input() currentPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  totalPages = 0;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    this.pages = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

    // если текущая страница стала невалидной (например после фильтра)
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.emitPage(1);
    }
  }

  emitPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit(page);
  }

  prev(): void {
    this.emitPage(this.currentPage - 1);
  }

  next(): void {
    this.emitPage(this.currentPage + 1);
  }
}
