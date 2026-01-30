import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { BlogItemImageComponent } from '../blog-item-image/blog-item-image';
import { BlogItemTextComponent } from '../blog-item-text/blog-item-text';
import { RatingComponent } from '../../shared/rating/rating';
import { DataService } from '../../services/data';
import { AuthService } from '../../services/auth';
import { LikesService } from '../../services/likes';

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

  @Input({ required: true }) id!: string;
  @Input() title!: string;
  @Input() text!: string;
  @Input() image!: string;
  @Input() author!: string;

  @Output() deleted = new EventEmitter<string>();

  likes: string[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private likesService: LikesService,
    private router: Router
  ) {}

  get postId(): string {
    return String(this.id);
  }

  get userId(): string | null {
    return this.authService.getUserId();
  }

  ngOnInit(): void {
    this.likes = this.likesService.getLikes(this.postId);
  }


  get likesCount(): number {
    return this.likes.length;
  }

  isLikedByMe(): boolean {
    return !!this.userId && this.likes.includes(this.userId);
  }

  toggleLike(): void {
    if (!this.userId) return;
    this.likes = this.likesService.toggleLike(this.postId, this.userId);
  }

  isAuthor(): boolean {
    const login = this.authService.getLogin();
    return !!login && login === this.author;
  }

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
