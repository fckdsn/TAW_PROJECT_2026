import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoritesService } from '../../services/favorites';
import { DataService } from '../../services/data';
import { BlogItemComponent } from '../blog-item/blog-item';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export class FavoritesComponent implements OnInit {

  favoritesPosts: any[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const favoriteIds = this.favoritesService.getFavorites();

    this.dataService.getAll().subscribe(posts => {
      this.favoritesPosts = posts.filter(post =>
        favoriteIds.includes(post.id)
      );
    });
  }
}
