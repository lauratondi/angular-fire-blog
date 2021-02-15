import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { AuthService } from '../../core/auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  editing = false;
  user: User | any;

  constructor(private auth: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.getUser();
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
}
