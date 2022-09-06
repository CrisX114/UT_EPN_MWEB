import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DetailsJRoutingModule } from './details-j-routing.module';
import { DetailsJComponent } from './details-j.component';

@NgModule({
  declarations: [DetailsJComponent],
  imports: [
    CommonModule,
    DetailsJRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class DetailsJModule {}
