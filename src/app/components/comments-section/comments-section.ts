import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments';

interface Comment {
  author: string;
  text: string;
}

@Component({
  selector: 'comments-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CommentsService],
  templateUrl: './comments-section.html',
  styleUrls: ['./comments-section.scss']
})
export class CommentsSectionComponent implements OnInit, OnChanges {

  @Input() postId: string = '';

  comments: Comment[] = [];
  newAuthor = '';
  newText = '';

  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId']) {
      this.loadComments();
    }
  }

  loadComments(): void {
    if (!this.postId) {
      this.comments = [];
      return;
    }
    this.comments = this.commentsService.getComments(this.postId);
  }

  addComment(): void {
    if (!this.newAuthor || !this.newText || !this.postId) return;

    this.commentsService.addComment(
      this.postId,
      this.newAuthor,
      this.newText
    );

    this.loadComments();
    this.newAuthor = '';
    this.newText = '';
  }
}
