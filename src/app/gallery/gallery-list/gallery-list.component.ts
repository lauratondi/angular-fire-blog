import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css'],
})
export class GalleryListComponent implements OnInit {
  images: Observable<any[]>;

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.getImages();
    console.log(this.images);
  }

  getImages() {
    this.images = this.galleryService.getImages();
    this.images.subscribe((res) => console.log(res));
  }
}
