import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'blog-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-item.html',
  styleUrls: ['./blog-item.css']
})
export class BlogItemComponent {
  @Input() id!: string; 
  @Input() title!: string;
  @Input() text!: string;
  @Input() image!: string;
  @Input() author!: string;
  
  @Output() deleted = new EventEmitter<string>();
  @Output() favoriteChanged = new EventEmitter<void>();

  constructor(private favoritesService: FavoritesService) {}

  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.id);
  }

  toggleFavorite(): void {
    this.favoritesService.toggleFavorite(this.id); 
    this.favoriteChanged.emit();
  }

  delete(): void {
    this.deleted.emit(this.id); 
  }
}