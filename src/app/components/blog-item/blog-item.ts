import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { BlogItemImageComponent } from '../blog-item-image/blog-item-image';
import { BlogItemTextComponent } from '../blog-item-text/blog-item-text';
import { RatingComponent } from '../../shared/rating/rating';

import { DataService } from '../../services/data';
import { AuthService } from '../../services/auth';
import { LikesService } from '../../services/likes';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'blog-item',
  standalone: true,
  imports: [
    CommonModule,
    BlogItemImageComponent,
    BlogItemTextComponent,
    RatingComponent
  ],
  templateUrl: './blog-item.html',
  styleUrls: ['./blog-item.scss']
})
export class BlogItemComponent implements OnInit {

  /*INPUT*/

  @Input({ required: true }) id!: string;
  @Input() title!: string;
  @Input() text!: string;
  @Input() image!: string;
  @Input() author!: string;

  /*OUTPUTS */

  @Output() deleted = new EventEmitter<string>();

  /* STATE  */

  likes: string[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private likesService: LikesService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  /* GETTERS */

  get postId(): string {
    return String(this.id);
  }

  get userId(): string | null {
    return this.authService.getUserId();
  }

  /* INIT  */

  ngOnInit(): void {
    this.likes = this.likesService.getLikes(this.postId);
  }

  /*  LIKES */

  get likesCount(): number {
    return this.likes.length;
  }

  isLikedByMe(): boolean {
    return !!this.userId && this.likes.includes(this.userId);
  }

  toggleLike(): void {
    if (!this.userId) return;

    const likedBefore = this.isLikedByMe();
    const favoriteBefore = this.favoritesService.isFavorite(this.postId);

    this.likes = this.likesService.toggleLike(this.postId, this.userId);

    const likedAfter = this.isLikedByMe();

    if (likedAfter !== favoriteBefore) {
      this.favoritesService.toggleFavorite(this.postId);
    }
  }

  /* AUTHOR */

  isAuthor(): boolean {
    const login = this.authService.getLogin();
    return !!login && login === this.author;
  }

  /* ACTIONS  */

  deletePost(): void {
    if (!confirm('Czy na pewno chcesz usunąć post?')) return;

    this.dataService.deletePost(this.postId).subscribe({
      next: () => this.deleted.emit(this.postId),
      error: err => console.error('DELETE ERROR', err)
    });
  }

  editPost(): void {
    this.router.navigate(['/blog/edit', this.postId]);
  }

  goToDetails(): void {
    this.router.navigate(['/blog/detail', this.postId]);
  }
}
