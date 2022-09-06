import { AdminGuard } from './components/guards/admin.guard';
import { AuthGuard } from './components/guards/auth.guard';
import { LoginGuard } from './components/guards/login.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./views/auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'r-password',
    loadChildren: () =>
      import('./views/auth/r-password/r-password.module').then(
        (m) => m.RPasswordModule
      ),
  },
  {
    path: 'g-users',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./views/g-users/g-users.module').then((m) => m.GUsuariosModule),
  },

  {
    path: 'details',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./views/details/details.module').then((m) => m.DetailsModule),
  },
  {
    path: 'new',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./views/new/new.module').then((m) => m.NewModule),
  },
  {
    path: 'edit-user',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./views/edit-user/edit-user.module').then(
        (m) => m.EditUserModule
      ),
  },
  {
    path: 'justific',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/justific/justific.module').then((m) => m.JustificModule),
  },
  {
    path: 'data',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/data/data.module').then((m) => m.DataModule),
  },
  {
    path: 'new-j',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/new-j/new-j.module').then((m) => m.NewJModule),
  },
  {
    path: 'details-j',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/details-j/details-j.module').then(
        (m) => m.DetailsJModule
      ),
  },
  {
    path: 'preferences',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/preferences/preferences.module').then(
        (m) => m.PreferencesModule
      ),
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
