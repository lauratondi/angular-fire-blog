import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';

import { PostService } from '../post.service';
import { AuthService } from 'src/app/core/auth.service';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.css'],
})
export class PostDashboardComponent implements OnInit {
  @ViewChild('resetMe', { static: true })
  inputField: any;

  postForm: FormGroup;
  uploadPercent: Observable<any>;
  downloadURL: Observable<string>;
  imageURL: string;

  constructor(
    private postService: PostService,
    private storage: AngularFireStorage,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.postForm = this.fb.group({
      title: [''],
      content: [''],
      draft: false,
    });
  }

  savePost() {
    const formData: Post = {
      author: this.auth.currentUserId,
      title: this.postForm.get('title')!.value,
      image: this.imageURL || null,
      content: this.postForm.get('content')!.value,
      draft: this.postForm.get('draft')?.value,
      published: new Date(),
      claps: 0,
    };
    if (!this.postForm.untouched) {
      this.postService.create(formData);
      console.log('Your post is posted');
    }

    this.postForm.reset();
    this.imageURL = '';
    // here we set the inputField back to empty
    this.inputField.nativeElement.value = '';
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
}
