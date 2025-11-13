import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessorService {
  private validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'ico'];

  constructor() { }

  /**
   * Procesa una imagen redimensionándola a las dimensiones especificadas.
   * @param file El archivo de imagen a procesar.
   * @param targetWidth El ancho deseado de la imagen.
   * @param targetHeight La altura deseada de la imagen.
   * @returns Una promesa que se resuelve con la URL de la imagen redimensionada.
   */
  async processImage(file: File, targetWidth: number, targetHeight: number): Promise<string> {
    // Verificar extensión
    const extension = this.getFileExtension(file.name);
    if (!this.isValidExtension(extension)) {
      throw new Error('Formato de archivo no válido. Se permiten: ' + this.validExtensions.join(', '));
    }

    // Crear URL temporal de la imagen
    const imageUrl = URL.createObjectURL(file);
    
    try {
      // Cargar imagen y obtener dimensiones originales
      const originalImage = await this.loadImage(imageUrl);
      
      // Crear canvas para redimensionar
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('No se pudo crear el contexto del canvas');
      }
      
      // Dibujar imagen redimensionada
      ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);
      
      // Determinar el formato de salida basado en la extensión
      const outputFormat = this.getOutputFormat(extension);
      
      // Convertir a blob y obtener URL
      const resizedImageUrl = await this.canvasToBlob(canvas, outputFormat);
      
      // Descargar imagen redimensionada
      this.downloadImage(resizedImageUrl, `resized_${file.name}`);
      
      return resizedImageUrl;
    } finally {
      // Limpiar URL temporal
      URL.revokeObjectURL(imageUrl);
    }
  }

  /**
   * Obtiene la extensión del archivo a partir del nombre.
   * @param filename El nombre del archivo.
   * @returns La extensión del archivo en minúsculas.
   */
  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Verifica si la extensión del archivo es válida.
   * @param extension La extensión del archivo.
   * @returns Verdadero si la extensión es válida, falso en caso contrario.
   */
  private isValidExtension(extension: string): boolean {
    return this.validExtensions.includes(extension);
  }

  /**
   * Determina el formato de salida MIME basado en la extensión del archivo.
   * @param extension La extensión del archivo.
   * @returns El formato MIME correspondiente.
   */
  private getOutputFormat(extension: string): string {
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'ico':
        return 'image/x-icon';
      default:
        return 'image/jpeg'; // Formato por defecto
    }
  }

  /**
   * Carga una imagen desde una URL.
   * @param url La URL de la imagen.
   * @returns Una promesa que se resuelve con el elemento de imagen.
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Convierte un canvas a una URL de blob.
   * @param canvas El canvas a convertir.
   * @param mimeType El tipo MIME para la conversión.
   * @param quality La calidad de la imagen (para formatos que lo soportan).
   * @returns Una promesa que se resuelve con la URL del blob.
   */
  private canvasToBlob(canvas: HTMLCanvasElement, mimeType: string = 'image/jpeg', quality: number = 0.95): Promise<string> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        }
      }, mimeType, quality);
    });
  }

  /**
   * Descarga una imagen desde una URL.
   * @param url La URL de la imagen.
   * @param filename El nombre del archivo para la descarga.
   */
  private downloadImage(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}