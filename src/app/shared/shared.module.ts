import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
})
export class SharedModule {}
