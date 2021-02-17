import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/core/auth.service';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.css'],
})
export class PostListItemComponent implements OnInit {
  @Input() post: Post;
  editing = false;
  uploadPercent: Observable<any>;
  downloadURL: Observable<string>;
  imageURL: string;

  constructor(
    private postService: PostService,
    private storage: AngularFireStorage,
    public auth: AuthService
  ) {}

  ngOnInit(): void {}

  delete(id: string) {
    this.postService.delete(id);
  }

  update() {
    const formData = {
      title: this.post.title,
      image: this.imageURL || this.post.image,
      content: this.post.content,
      draft: this.post.draft,
    };
    this.postService.update(this.post.id, formData);
    this.editing = false;
  }

  uploadPostImage(event: any) {
    const file = event.target.files[0];
    const path = `posts/${file.name}`;
    const ref = this.storage.ref(path);
    const task = this.storage.upload(path, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task
      .snapshotChanges()
      .pipe(
        finalize(() =>
          ref.getDownloadURL().subscribe((downloadURL) => {
            this.imageURL = downloadURL;
            console.log('Image Uploaded');
          })
        )
      )
      .subscribe();
  }

  trending(value: number) {
    if (this.post.id) {
      this.postService.update(this.post.id, { trending: value + 1 });
    }
  }
}
