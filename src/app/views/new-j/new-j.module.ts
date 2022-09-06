import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewJRoutingModule } from './new-j-routing.module';
import { NewJComponent } from './new-j.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NewJComponent],
  imports: [CommonModule, NewJRoutingModule, FormsModule, ReactiveFormsModule],
})
export class NewJModule {}
