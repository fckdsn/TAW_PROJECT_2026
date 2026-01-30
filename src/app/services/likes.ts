import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type LikesMap = Record<string, string[]>;

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  private readonly STORAGE_KEY = 'blog_likes';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private read(): LikesMap {
    if (!isPlatformBrowser(this.platformId)) return {};
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
  }

  private write(data: LikesMap): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getLikes(postId: string): string[] {
    return this.read()[postId] || [];
  }

  isLikedByUser(postId: string, userId: string): boolean {
    return this.getLikes(postId).includes(userId);
  }

  toggleLike(postId: string, userId: string): string[] {
    const data = this.read();
    const likes = data[postId] || [];

    if (likes.includes(userId)) {
      data[postId] = likes.filter(id => id !== userId);
    } else {
      data[postId] = [...likes, userId];
    }

    this.write(data);
    return data[postId];
  }
}
