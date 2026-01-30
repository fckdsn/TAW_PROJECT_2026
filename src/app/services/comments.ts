import { Injectable } from '@angular/core';

interface Comment {
  author: string;
  text: string;
}

const initialComments: { [key: string]: Comment[] } = {
  "64549b5362f53f833c89f6ab": [
    { author: "Jan K.", text: "Świetny post, dużo mi rozjaśnił!" },
    { author: "Anna M.", text: "Czekam na kolejną część." }
  ],
  "645e329db1979e2e900a94d5": [
    { author: "Piotr", text: "Zgadzam się, kryptografia jest kluczowa." }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private comments = initialComments;

  constructor() {}

  getComments(postId: string): Comment[] {
    return this.comments[postId] || [];
  }

  addComment(postId: string, author: string, text: string): void {
    const newComment: Comment = { author, text };

    if (!this.comments[postId]) {
      this.comments[postId] = [];
    }

    this.comments[postId].push(newComment);
  }
}
