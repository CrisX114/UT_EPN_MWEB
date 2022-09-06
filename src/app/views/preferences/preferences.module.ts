import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreferencesRoutingModule } from './preferences-routing.module';
import { PreferencesComponent } from './preferences.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    CommonModule,
    PreferencesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class PreferencesModule {}
