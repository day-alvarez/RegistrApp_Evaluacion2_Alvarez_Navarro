import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroCursoPageRoutingModule } from './registro-curso-routing.module';

import { RegistroCursoPage } from './registro-curso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroCursoPageRoutingModule
  ],
  declarations: [RegistroCursoPage]
})
export class RegistroCursoPageModule {}
