// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ScaleImgComponent } from './component/scale-img/scale-img.component';
import { ConvertidorImgComponent } from './component/convertidor-img/convertidor-img.component';
import { Error404Component } from './component/error-404/error-404.component';
import { BackgroundRemoverComponent } from './component/background-remover/background-remover.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },//home
  { path: 'scale', component: ScaleImgComponent },
  { path: 'converter', component: ConvertidorImgComponent },
  { path: 'remover', component: BackgroundRemoverComponent },
  { path: '**', component: Error404Component } // Ruta wildcard para capturar rutas no definidas
];
