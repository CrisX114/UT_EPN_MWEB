import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewRoutingModule } from './new-routing.module';
import { NewComponent } from './new.component';

@NgModule({
  declarations: [NewComponent],
  imports: [CommonModule, NewRoutingModule, ReactiveFormsModule, FormsModule],
})
export class NewModule {}
