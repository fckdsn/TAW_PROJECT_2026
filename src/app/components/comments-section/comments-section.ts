import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommentsService, Comment } from '../../services/comments';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'comments-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-section.html',
  styleUrls: ['./comments-section.scss']
})
export class CommentsSectionComponent implements OnInit, OnChanges {

  @Input() postId!: string;

  comments: Comment[] = [];
  newText = '';
  loading = false;

  constructor(
    private commentsService: CommentsService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId'] && this.postId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    if (!this.postId) return;

    this.loading = true;
    this.commentsService.getComments(this.postId).subscribe({
      next: comments => {
        this.comments = comments;
        this.loading = false;
      },
      error: err => {
        console.error('Load comments error', err);
        this.loading = false;
      }
    });
  }

  addComment(): void {
    if (!this.newText.trim() || !this.postId) return;

    this.commentsService.addComment(this.postId, this.newText).subscribe({
      next: () => {
        this.newText = '';
        this.loadComments();
      },
      error: err => {
        console.error('Add comment error', err);
      }
    });
  }

  deleteComment(id: string): void {
    this.commentsService.deleteComment(id).subscribe({
      next: () => this.loadComments(),
      error: err => {
        console.error('Delete comment error', err);
      }
    });
  }
}
