import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    AuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
  ],
  providers: [AuthService],
})
export class CoreModule {}
