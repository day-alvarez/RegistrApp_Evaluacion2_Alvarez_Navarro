import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroCursoPage } from './registro-curso.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroCursoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroCursoPageRoutingModule {}
