import { Component, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';

import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { User } from '../user.model';
import { AuthService } from '../../core/auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  // @Output() path: string;
  editing = false;
  user: User | any;
  task: AngularFireUploadTask;

  path: string;
  meta: object;
  uploadType: boolean;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private storage: AngularFireStorage,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.setUploadData();
  }

  setUploadData() {
    return this.auth.user.subscribe((user: User) => {
      this.path = `users/${user.uid}/gallery`;
      this.meta = { uploader: user.uid, website: 'lauratondi.net' };
      this.uploadType = true;
    });
  }

  getUser() {
    return this.auth.user.subscribe((user: User) => (this.user = user));
  }

  updateProfile() {
    return this.userService.updateProfileData(
      this.user.displayName,
      this.user.photoURL
    );
  }

  updateEmail() {
    return this.userService.updateEmailData(this.user.email);
  }

  uploadPhotoURL(event: any): void {
    const file = event.target.files[0];
    const path = `users/${this.user.uid}/photos/${file.name}`;

    if (file.type.split('/')[0] !== 'image') {
      return alert('Only images allowed');
    } else {
      this.task = this.storage.upload(path, file);
      const ref = this.storage.ref(path);

      ref.getDownloadURL().subscribe((url) => {
        this.userService.updateProfileData(this.user.displayName, url);
      });
    }
  }

  updateUser() {
    const data = {
      website: this.user.website || null,
      location: this.user.location || null,
      bio: this.user.bio || null,
    };
    return this.userService.updateUserData(data);
  }

  goBack() {
    this.location.back();
  }
}
