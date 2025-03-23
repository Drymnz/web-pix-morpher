// src/app/component/convertidor-img/convertidor-img.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";
import { ImageProcessorService } from '../../services/download-imge/image-processor.service'; // Importar el servicio

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
  archivoSeleccionado: File | null = null; // Almacenar el archivo seleccionado

  // Formatos disponibles
  formatosDisponibles = ['png', 'jpg', 'webp', 'gif'];

  // Inyectar el servicio ImageProcessorService
  constructor(private imageProcessorService: ImageProcessorService) {}

  // Método para seleccionar una imagen
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file; // Guardar el archivo seleccionado
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenSeleccionada = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para convertir la imagen
  async convertirImagen(): Promise<void> {
    if (!this.archivoSeleccionado) {
      alert('Por favor, selecciona una imagen primero.');
      return;
    }

    try {
      // Definir dimensiones de salida (puedes ajustarlas según tus necesidades)
      const targetWidth = 800;
      const targetHeight = 600;

      // Procesar la imagen usando el servicio
      const resizedImageUrl = await this.imageProcessorService.processImage(
        this.archivoSeleccionado,
        targetWidth,
        targetHeight
      );

      // Descargar la imagen redimensionada
      const nombreArchivo = `converted_image.${this.formatoSalida}`;
      this.descargarImagen(resizedImageUrl, nombreArchivo);

      //alert(`Imagen convertida y descargada como ${nombreArchivo}`);
    } catch (error) {
      console.error('Error al convertir la imagen:', error);
      alert('Ocurrió un error al convertir la imagen. Verifica el formato.');
    }
  }

  // Método para descargar la imagen
  private descargarImagen(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}