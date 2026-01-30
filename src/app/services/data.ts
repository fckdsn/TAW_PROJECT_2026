import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {

  private url = '/api';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ---------- POSTS ----------

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/posts`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/posts/${id}`);
  }

  addPost(post: any): Observable<any> {
    return this.http.post<any>(
      `${this.url}/posts`,
      post,
      { headers: this.authHeaders() }
    );
  }

  updatePost(id: string, post: any): Observable<any> {
    return this.http.put<any>(
      `${this.url}/posts/${id}`,
      post,
      { headers: this.authHeaders() }
    );
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.url}/posts/${id}`,
      { headers: this.authHeaders() }
    );
  }

  // ---------- USER ----------

  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/user/profile/${userId}`,
      { headers: this.authHeaders() }
    );
  }

  updateUserProfile(data: { name: string; email: string }): Observable<any> {
    return this.http.put<any>(
      `${this.url}/user/update`,
      data,
      { headers: this.authHeaders() }
    );
  }
}
