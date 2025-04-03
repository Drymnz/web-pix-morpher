import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";
import { ImageProcessorService } from '../../services/download-imge/image-processor.service';
import { FORMATOS_MAPA } from '../../model/converter.model';
import { descargarArchivo, generarNombreArchivo } from '../../utils/file-utils';

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
  archivoSeleccionado: File | null = null;
  
  // Configuración adicional
  calidad: number = 90;
  mantenerAspecto: boolean = true;
  anchoPersonalizado: number = 800;
  altoPersonalizado: number = 600;
  rotacion: number = 0;
  brillo: number = 0;
  contraste: number = 0;
  
  // Formatos disponibles
  formatosDisponibles = Object.keys(FORMATOS_MAPA);
  
  constructor(private imageProcessorService: ImageProcessorService) {}

  /**
   * Maneja la selección de un archivo de imagen
   */
  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;
    
    this.archivoSeleccionado = file;
    
    // Cargar vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagenSeleccionada = e.target?.result || null;
    };
    reader.readAsDataURL(file);
    
    // Detectar dimensiones originales
    try {
      const dimensiones = await this.imageProcessorService.detectarDimensionesOriginales(file);
      this.anchoPersonalizado = dimensiones.ancho;
      this.altoPersonalizado = dimensiones.alto;
    } catch (error) {
     // console.error('Error al detectar dimensiones:', error);
    }
  }

  /**
   * Inicia el proceso de conversión de la imagen
   */
  async convertirImagen(): Promise<void> {
    if (!this.archivoSeleccionado) {
      alert('Por favor, selecciona una imagen primero.');
      return;
    }

    try {
      // Configurar opciones de procesamiento
      const opciones = {
        formato: this.formatoSalida,
        calidad: this.calidad,
        ancho: this.anchoPersonalizado,
        alto: this.altoPersonalizado,
        mantenerAspecto: this.mantenerAspecto,
        rotacion: this.rotacion,
        brillo: this.brillo,
        contraste: this.contraste
      };
      
      // Procesar la imagen
      const imagenProcesada = await this.imageProcessorService.processImageAdvanced(
        this.archivoSeleccionado, 
        opciones
      );

      // Generar nombre y descargar
      const nombreArchivo = generarNombreArchivo(
        this.archivoSeleccionado.name, 
        this.formatoSalida
      );
      
      descargarArchivo(imagenProcesada, nombreArchivo);
    } catch (error) {
     // console.error('Error al convertir la imagen:', error);
      alert('Ocurrió un error al convertir la imagen.');
    }
  }
  
  /**
   * Verifica si el formato seleccionado soporta transparencia
   */
  soportaTransparencia(): boolean {
    return FORMATOS_MAPA[this.formatoSalida]?.soportaTransparencia || false;
  }
  
  /**
   * Verifica si el formato seleccionado es con pérdida
   */
  esFormatoConPerdida(): boolean {
    return FORMATOS_MAPA[this.formatoSalida]?.conPerdida || false;
  }
}
