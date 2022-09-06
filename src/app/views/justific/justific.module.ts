import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JustificRoutingModule } from './justific-routing.module';
import { JustificComponent } from './justific.component';

import { PipesModuleModule } from '../../components/pipe/pipes-module/pipes-module.module';

@NgModule({
  declarations: [JustificComponent],
  imports: [
    CommonModule,
    JustificRoutingModule,
    FormsModule,
    PipesModuleModule,
  ],
})
export class JustificModule {}
