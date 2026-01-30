import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data';
import { BlogItemComponent } from '../blog-item/blog-item';
import { FilterTextPipe } from '../../pipes/filter-text-pipe';
import { PaginatePipe } from '../../pipes/paginate-pipe';
import { PaginationComponent } from '../../shared/pagination/pagination';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    BlogItemComponent,
    FilterTextPipe,
    PaginatePipe,
    PaginationComponent
  ],
  templateUrl: './blog.html'
})
export class BlogComponent implements OnInit {

  @Input() filterText = '';

  items: any[] = [];
  visibleItems: any[] = [];

  currentPage = 1;
  itemsPerPage = 5;

  activeTab: 'all' | 'favorites' = 'all';

  favoritesCount = 0;

  constructor(
    private service: DataService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.favoritesService.favoritesCount$
      .subscribe(count => this.favoritesCount = count);

    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      this.itemsPerPage = +params['limit'] || 5;
    });

    this.loadPosts();
  }

  loadPosts(): void {
    this.service.getAll().subscribe(posts => {

      this.items = posts.map(p => {
        const id = p.id ?? p._id;

        if (!id) {
          console.error('POST WITHOUT ID!', p);
        }

        return {
          ...p,
          id: String(id)
        };
      });

      this.updateVisibleItems(true);
    });
  }

  setTab(tab: 'all' | 'favorites'): void {
    this.activeTab = tab;
    this.updateVisibleItems(true);
  }

  updateVisibleItems(resetPage = false): void {
    if (this.activeTab === 'favorites') {
      const favIds = this.favoritesService.getFavorites();
      this.visibleItems = this.items.filter(item =>
        favIds.includes(item.id)
      );
    } else {
      this.visibleItems = [...this.items];
    }

    if (resetPage) {
      this.changePage(1);
    }
  }

  changePage(page: number): void {
    this.currentPage = page;

    this.router.navigate([], {
      queryParams: {
        page: this.currentPage,
        limit: this.itemsPerPage
      },
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(page: number): void {
    this.changePage(page);
  }

  removeFromList(id: string): void {
    this.items = this.items.filter(p => p.id !== id);
    this.updateVisibleItems(true);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.visibleItems.length / this.itemsPerPage));
  }
}
