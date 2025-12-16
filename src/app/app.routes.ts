// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ScaleImgComponent } from './component/scale-img/scale-img.component';
import { ConvertidorImgComponent } from './component/convertidor-img/convertidor-img.component';
import { Error404Component } from './component/error-404/error-404.component';
import { BackgroundRemoverComponent } from './component/background-remover/background-remover.component';
import { PoliticaPriacidadComponent } from './component/politica-priacidad/politica-priacidad.component';
import { TerminosCondicionesComponent } from './component/terminos-condiciones/terminos-condiciones.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'PixMorpher - Home'
  },
  { 
    path: 'scale', 
    component: ScaleImgComponent,
    title: 'PixMorpher - Scale Images'
  },
  { 
    path: 'converter', 
    component: ConvertidorImgComponent,
    title: 'PixMorpher - Image Converter'
  },
  { 
    path: 'remover', 
    component: BackgroundRemoverComponent,
    title: 'PixMorpher - Background Remover'
  },
  { 
    path: 'privacy', 
    component: PoliticaPriacidadComponent,
    title: 'PixMorpher - Privacy Policy'
  },
  { 
    path: 'terms', 
    component: TerminosCondicionesComponent,
    title: 'PixMorpher - Terms and Conditions'
  },
  { 
    path: '**', 
    component: Error404Component,
    title: 'PixMorpher - Page Not Found'
  }
];