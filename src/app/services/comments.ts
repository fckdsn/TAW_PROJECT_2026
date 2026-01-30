import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  _id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private readonly baseUrl = '/api/comments';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'x-auth-token': token ? `Bearer ${token}` : ''
    });
  }

  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/${postId}`);
  }

  addComment(postId: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(
      this.baseUrl,
      { postId, text },
      { headers: this.authHeaders() }
    );
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${commentId}`,
      { headers: this.authHeaders() }
    );
  }
}
