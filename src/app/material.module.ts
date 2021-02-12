import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  exports: [MatButtonModule, MatIconModule, MatInputModule],
  imports: [MatButtonModule, MatIconModule, MatInputModule],
})
export class MaterialModule {}
