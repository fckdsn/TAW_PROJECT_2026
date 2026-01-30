import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data';
import { CommonModule } from '@angular/common';

interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
}

@Component({
  selector: 'gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class GalleryComponent implements OnInit {

  public images: GalleryItem[] = [];
  public selectedImage: GalleryItem | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.dataService.getAll().subscribe((posts: any[]) => {
      this.images = posts
        .filter(post => post.image)
        .map(post => ({
          id: post.id,
          imageUrl: post.image,
          title: post.title
        }));
    });
  }

  openLightbox(item: GalleryItem): void {
    this.selectedImage = item;
  }

  closeLightbox(): void {
    this.selectedImage = null;
  }
}
