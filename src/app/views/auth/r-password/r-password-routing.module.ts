import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RPasswordComponent } from './r-password.component';

const routes: Routes = [{ path: '', component: RPasswordComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RPasswordRoutingModule { }
