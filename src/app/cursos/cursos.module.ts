import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CursosPageRoutingModule } from './cursos-routing.module';
import { QRCodeModule } from 'angularx-qrcode'; 

import { CursosPage } from './cursos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CursosPageRoutingModule,
    QRCodeModule 

  ],
  declarations: [CursosPage]
})
export class CursosPageModule {}
