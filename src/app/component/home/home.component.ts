// src/app/component/home/home.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";
import { FeatureCard } from '../../services/load-json/tool.modelo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NavComponent, FooterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  factureCards: FeatureCard[] = [];
  loading = true;
  error = '';
  constructor() {}
  ngOnInit() {

  }
}
