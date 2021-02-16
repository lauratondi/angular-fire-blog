import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { PostService } from './post.service';

import { PostDashboardComponent } from './post-dashboard/post-dashboard.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostListItemComponent } from './post-list-item/post-list-item.component';

const routes: Routes = [
  { path: 'blog', component: PostListComponent },
  { path: 'blog/:id', component: PostDetailComponent },
];

@NgModule({
  declarations: [
    PostDashboardComponent,
    PostDetailComponent,
    PostListComponent,
    PostListItemComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [PostDashboardComponent],
  providers: [PostService],
})
export class PostModule {}
