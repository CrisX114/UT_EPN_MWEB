import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GUsuariosRoutingModule } from './g-users-routing.module';
import { GUsuariosComponent } from './g-users.component';

@NgModule({
  declarations: [GUsuariosComponent],
  imports: [CommonModule, GUsuariosRoutingModule],
})
export class GUsuariosModule {}
