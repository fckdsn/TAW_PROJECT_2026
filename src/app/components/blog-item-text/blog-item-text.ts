import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'blog-item-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="card-text">
      {{ shortText }}
      <a
        class="text-primary ms-1"
        style="cursor:pointer"
        (click)="more.emit()">
        Więcej
      </a>
    </p>
  `
})
export class BlogItemTextComponent {

  @Input() text!: string;
  @Output() more = new EventEmitter<void>();

  get shortText(): string {
    return this.text?.length > 150
      ? this.text.slice(0, 150) + '...'
      : this.text;
  }
}
