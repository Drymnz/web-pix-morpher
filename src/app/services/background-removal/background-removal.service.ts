import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BackgroundRemovalService {
  private segmentation: any;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      import('@mediapipe/selfie_segmentation').then(({ SelfieSegmentation }) => {
        this.segmentation = new SelfieSegmentation({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });
        this.segmentation.setOptions({ modelSelection: 0 });
      });
    }
  }

  async removeBackground(
    image: HTMLImageElement, 
    canvas: HTMLCanvasElement, 
    options: {
      threshold?: number;
      useColorKey?: boolean;
      keyColor?: string;
      colorTolerance?: number;
    } = {}
  ): Promise<string> {
    const { 
      threshold = 0.7, 
      useColorKey = false, 
      keyColor = '#00FF00', 
      colorTolerance = 30 
    } = options;
    
    if (useColorKey) {
      return this.removeColorBackground(image, canvas, keyColor, colorTolerance);
    } else {
      return this.removeBackgroundWithAI(image, canvas, threshold);
    }
  }

  private async removeBackgroundWithAI(
    image: HTMLImageElement, 
    canvas: HTMLCanvasElement, 
    threshold: number
  ): Promise<string> {
    if (typeof window === 'undefined') return '';

    const { SelfieSegmentation } = await import('@mediapipe/selfie_segmentation');
    const segmentation = new SelfieSegmentation({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
    });

    // Usar el modelo 0 que es más preciso para personas y objetos
    segmentation.setOptions({ modelSelection: 0 });

    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No se pudo obtener el contexto del canvas');

      // Pre-procesamiento: Dibujar la imagen original en el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Configurar el callback para cuando se completa la segmentación
      segmentation.onResults(async (results: any) => {
       // console.log('Resultados de segmentación:', results);

        // Crear un canvas temporal para el post-procesamiento de la máscara
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (!tempCtx) return reject('No se pudo crear el contexto temporal');
        
        // Dibujar la máscara de segmentación en el canvas temporal
        tempCtx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
        
        // Aplicar ajustes a la máscara para mejorar la detección
        let imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Aplicar suavizado a la máscara para reducir bordes dentados
        this.applyGaussianBlur(imageData, 1);
        
        // Aplicar umbral adaptativo para mejorar la detección con valores bajos
        this.applyAdaptiveThreshold(imageData, threshold);
        
        // Si el umbral es muy bajo, aplicar dilatación para mejorar los bordes
        if (threshold <= 0.3) {
          this.applyDilation(imageData, 1);
        }
        
        tempCtx.putImageData(imageData, 0, 0);
        
        // Aplicar la máscara mejorada a la imagen original
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';

        // Convertir el canvas en un Blob para descargar
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url); // Retorna la URL de la imagen procesada
          } else {
            reject('No se pudo convertir el canvas a Blob');
          }
        }, 'image/png');
      });

      segmentation.send({ image }).catch(reject);
    });
  }

  private removeColorBackground(
    image: HTMLImageElement, 
    canvas: HTMLCanvasElement, 
    keyColor: string, 
    tolerance: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No se pudo obtener el contexto del canvas');

      // Dibujar la imagen original en el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Obtener los datos de la imagen
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convertir el color clave de formato hex a RGB
      const keyColorRGB = this.hexToRgb(keyColor);
      if (!keyColorRGB) return reject('Color inválido');

      // Procesar cada píxel
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calcular la distancia de color (distancia euclidiana en el espacio RGB)
        const colorDistance = Math.sqrt(
          Math.pow(r - keyColorRGB.r, 2) +
          Math.pow(g - keyColorRGB.g, 2) +
          Math.pow(b - keyColorRGB.b, 2)
        );

        // Si la distancia es menor que la tolerancia, hacer el píxel transparente
        if (colorDistance < tolerance) {
          data[i + 3] = 0; // Canal alfa (transparencia)
        }
      }

      // Actualizar la imagen con los nuevos datos
      ctx.putImageData(imageData, 0, 0);

      // Convertir el canvas en un Blob para descargar
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject('No se pudo convertir el canvas a Blob');
        }
      }, 'image/png');
    });
  }

  // Convertir color hexadecimal a RGB
  private hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    // Eliminar el # si existe
    hex = hex.replace(/^#/, '');

    // Parsear el valor hexadecimal
    const bigint = parseInt(hex, 16);
    
    // Verificar si es un valor hexadecimal válido
    if (isNaN(bigint)) return null;
    
    // Extraer los componentes RGB
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  }

  // Métodos existentes para el procesamiento de imágenes
  private applyAdaptiveThreshold(imageData: ImageData, baseThreshold: number): void {
    // Implementación existente...
  }
  
  private applyGaussianBlur(imageData: ImageData, radius: number): void {
    // Implementación existente...
  }
  
  private applyDilation(imageData: ImageData, iterations: number): void {
    // Implementación existente...
  }
}
