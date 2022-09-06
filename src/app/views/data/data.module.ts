import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataRoutingModule } from './data-routing.module';
import { DataComponent } from './data.component';
import { FormsModule } from '@angular/forms';

import { PipesModuleModule } from '../../components/pipe/pipes-module/pipes-module.module';

@NgModule({
  declarations: [DataComponent],
  imports: [CommonModule, DataRoutingModule, FormsModule, PipesModuleModule],
})
export class DataModule {}
