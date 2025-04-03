import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";
import { ImagenLoadComponent } from "../imagen-load/imagen-load.component";
import { BackgroundRemovalService } from '../../services/background-removal/background-removal.service';
import { ImageProcessorService } from '../../services/download-imge/image-processor.service';

@Component({
  selector: 'app-background-remover',
  imports: [NavComponent, FooterComponent, ImagenLoadComponent, NgIf],
  templateUrl: './background-remover.component.html',
  styleUrl: './background-remover.component.css',
  providers: [BackgroundRemovalService]
})
export class BackgroundRemoverComponent {
  error: string = '';
  selectedFile: File | null = null;
  processedImageUrl: string | null = null;
  isProcessing: boolean = false;
  progress: number = 0;
  progressMessage: string = '';

  constructor(
    private backgroundService: BackgroundRemovalService,
    private imageProcessorService: ImageProcessorService
  ) {}

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.error = '';
    this.progress = 0;
    this.progressMessage = '';
  }

  async processImage(): Promise<void> {
    if (!this.selectedFile) {
      this.error = 'Selecciona una imagen primero.';
      return;
    }

    this.isProcessing = true;
    this.progress = 10;
    this.progressMessage = 'Iniciando procesamiento...';

    const selectedFile = this.selectedFile;
    const img = new Image();
    
    img.onload = async () => {
      try {
        this.progress = 30;
        this.progressMessage = 'Cargando modelo de segmentación...';
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // Actualizar progreso antes de remover el fondo
        this.progress = 50;
        this.progressMessage = 'Removiendo fondo de la imagen...';
        
        // Procesar la imagen para remover el fondo
        const processedImageUrl = await this.backgroundService.removeBackground(img, canvas);
        this.processedImageUrl = processedImageUrl;
        
        this.progress = 70;
        this.progressMessage = 'Preparando imagen para descarga...';
        
        // Crear un blob a partir de la URL procesada
        const response = await fetch(processedImageUrl);
        const blob = await response.blob();
        
        // Crear un nombre de archivo para la imagen sin fondo
        const fileName = selectedFile.name;
        const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1);
        const newFileName = `${fileNameWithoutExt}_sin_fondo.${fileExt}`;
        
        this.progress = 90;
        this.progressMessage = 'Descargando imagen...';
        
        // Método directo para descargar la imagen
        this.downloadBlob(blob, newFileName);
        
        // Liberar recursos
        URL.revokeObjectURL(processedImageUrl);
        
        this.progress = 100;
        this.progressMessage = '¡Procesamiento completado!';
        
        // Resetear después de un tiempo
        setTimeout(() => {
          if (this.progress === 100) {
            this.isProcessing = false;
            this.progress = 0;
            this.progressMessage = '';
          }
        }, 3000);
      } catch (err) {
        console.error('Error al procesar la imagen:', err);
        this.error = 'Error al procesar la imagen.';
        this.isProcessing = false;
        this.progress = 0;
        this.progressMessage = '';
      }
    };
    
    img.onerror = () => {
      this.error = 'Error al cargar la imagen.';
      this.isProcessing = false;
      this.progress = 0;
      this.progressMessage = '';
    };
    
    // Iniciar la carga de la imagen
    img.src = URL.createObjectURL(selectedFile);
  }

  // Método directo para descargar un blob como archivo
  private downloadBlob(blob: Blob, fileName: string): void {
    // Crear una URL para el blob
    const blobUrl = URL.createObjectURL(blob);
    
    // Crear un elemento de enlace para la descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = fileName;
    
    // Añadir el enlace al documento
    document.body.appendChild(downloadLink);
    
    // Simular un clic en el enlace para iniciar la descarga
    downloadLink.click();
    
    // Eliminar el enlace del documento
    document.body.removeChild(downloadLink);
    
    // Liberar la URL del blob
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);
    
  }
}