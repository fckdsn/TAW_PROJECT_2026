import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private readonly STORAGE_KEY = 'blog_favorites';

  // 🔥 observable-счётчик
  private countSubject = new BehaviorSubject<number>(0);
  favoritesCount$ = this.countSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.updateCount();
  }

  private normalize(id: string | number): string {
    return String(id);
  }

  private read(): string[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  private write(data: string[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this.updateCount();
  }

  private updateCount(): void {
    this.countSubject.next(this.read().length);
  }

  // ---------- PUBLIC API ----------

  getFavorites(): string[] {
    return this.read();
  }

  isFavorite(postId: string | number): boolean {
    const id = this.normalize(postId);
    return this.read().includes(id);
  }

  toggleFavorite(postId: string | number): void {
    const id = this.normalize(postId);
    const favorites = this.read();

    if (favorites.includes(id)) {
      favorites.splice(favorites.indexOf(id), 1);
    } else {
      favorites.push(id);
    }

    this.write(favorites);
  }
}
