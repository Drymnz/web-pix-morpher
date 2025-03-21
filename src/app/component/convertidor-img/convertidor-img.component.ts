// src/app/component/convertidor-img/convertidor-img.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-convertidor-img',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent, FooterComponent],
  templateUrl: './convertidor-img.component.html',
  styleUrl: './convertidor-img.component.css'
})
export class ConvertidorImgComponent {
  // Propiedades para el convertidor de imágenes
  imagenSeleccionada: string | ArrayBuffer | null = null;
  formatoSalida: string = 'png';
  
  // Formatos disponibles
  formatosDisponibles = ['png', 'jpg', 'webp', 'gif'];

  // Método para seleccionar una imagen
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenSeleccionada = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para convertir la imagen (simulado)
  convertirImagen(): void {
    // Aquí iría la lógica real de conversión
    alert(`Imagen convertida a formato ${this.formatoSalida}`);
  }
}
