import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data';
import { RatingComponent } from '../../shared/rating/rating';

@Component({
  selector: 'app-blog-item-details',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  templateUrl: './blog-item-details.html',
  styleUrls: ['./blog-item-details.scss']
})
export class BlogItemDetailsComponent implements OnInit {

  post: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.dataService.getById(id).subscribe({
      next: post => {
        this.post = post;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
