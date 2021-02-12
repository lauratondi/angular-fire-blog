import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, BrowserAnimationsModule, AuthModule],
})
export class CoreModule {}
