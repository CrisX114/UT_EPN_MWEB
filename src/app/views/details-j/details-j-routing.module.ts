import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsJComponent } from './details-j.component';

const routes: Routes = [{ path: '', component: DetailsJComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsJRoutingModule { }
