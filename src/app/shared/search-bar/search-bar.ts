import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html'
})
export class SearchBarComponent {

  filterText = '';

  @Output() name = new EventEmitter<string>();

  sendFilter(): void {
    this.name.emit(this.filterText);
  }
}
