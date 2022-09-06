import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JustificComponent } from './justific.component';

const routes: Routes = [{ path: '', component: JustificComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JustificRoutingModule { }
