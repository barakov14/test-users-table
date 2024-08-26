import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'my',
    loadComponent: () =>
      import('./modules/users/modules/users/users.component')
        .then(c => c.UsersComponent)
  },
  {
    path: '**',
    redirectTo: 'my'
  }
];
