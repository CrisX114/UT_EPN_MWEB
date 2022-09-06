import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GUsuariosComponent } from './g-users.component';

const routes: Routes = [{ path: '', component: GUsuariosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GUsuariosRoutingModule {}
