import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  exports: [MatButtonModule, MatIconModule, MatInputModule, MatCardModule],
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatCardModule],
})
export class MaterialModule {}
