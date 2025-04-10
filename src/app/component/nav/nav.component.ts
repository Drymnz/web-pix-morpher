import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class NavComponent {
  isMenuOpen = false;

  constructor(private router: Router) {} // Inyecta el servicio Router

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Método para redirigir a raiz
  goToHome() {
    this.router.navigate(['/']); // Navega a la ruta raiz
  }
}