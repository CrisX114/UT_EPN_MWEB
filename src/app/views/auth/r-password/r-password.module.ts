import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RPasswordRoutingModule } from './r-password-routing.module';
import { RPasswordComponent } from './r-password.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RPasswordComponent],
  imports: [CommonModule, RPasswordRoutingModule, ReactiveFormsModule],
})
export class RPasswordModule {}
