import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { FavoritesService } from './favorites';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const mockLocalStorage = {
    store: {} as Record<string, string>,

    getItem(key: string) {
      return this.store[key] || null;
    },

    setItem(key: string, value: string) {
      this.store[key] = value;
    },

    removeItem(key: string) {
      delete this.store[key];
    },

    clear() {
      this.store = {};
    }
  };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(FavoritesService);
    mockLocalStorage.clear();
  });

  it('should add and remove favorite', () => {
    service.toggleFavorite('1');
    expect(service.isFavorite('1')).toBe(true);

    service.toggleFavorite('1');
    expect(service.isFavorite('1')).toBe(false);
  });
});
