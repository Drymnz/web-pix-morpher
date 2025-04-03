import { Injectable } from '@angular/core';
import { ImageProcessingOptions, FORMATOS_MAPA } from '../../model/converter.model';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessorService {

  constructor() { }

  /**
   * Método original para compatibilidad con código existente
   */
  async processImage(file: File, width: number, height: number): Promise<string> {
    return this.processImageAdvanced(file, {
      formato: 'png',
      calidad: 90,
      ancho: width,
      alto: height,
      mantenerAspecto: false, // Cambia esto a false
      rotacion: 0,
      brillo: 0,
      contraste: 0
    });
  }

  /**
   * Procesa una imagen con las opciones especificadas
   */
  async processImageAdvanced(file: File, options: ImageProcessingOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No hay archivo seleccionado'));
        return;
      }

      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);

        // Calcular dimensiones finales
        const dimensions = this.calcularDimensionesFinales(
          img.width,
          img.height,
          options.ancho,
          options.alto,
          options.mantenerAspecto
        );

        // Crear canvas y procesar la imagen
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.ancho;
        canvas.height = dimensions.alto;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas'));
          return;
        }

        // Aplicar transformaciones
        this.aplicarTransformaciones(ctx, img, dimensions.ancho, dimensions.alto, options.rotacion);

        // Aplicar ajustes de imagen si es necesario
        if (options.brillo !== 0 || options.contraste !== 0) {
          this.aplicarAjustesImagen(ctx, dimensions.ancho, dimensions.alto, options.brillo, options.contraste);
        }

        // Obtener MIME type del formato
        const formatoInfo = FORMATOS_MAPA[options.formato.toLowerCase()] || FORMATOS_MAPA['png'];

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              resolve(blobUrl);
            } else {
              //console.error('Error: No se generó el blob');
              reject(new Error('Error al generar la imagen'));
            }
          },
          formatoInfo.mimeType,
          options.calidad / 100
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = url;
    });
  }

  /**
   * Calcula las dimensiones finales respetando la relación de aspecto si es necesario
   */
  private calcularDimensionesFinales(
    anchoOriginal: number,
    altoOriginal: number,
    anchoDeseado: number,
    altoDeseado: number,
    mantenerAspecto: boolean
  ): { ancho: number, alto: number } {

    if (!mantenerAspecto) {
      return { ancho: anchoDeseado, alto: altoDeseado };
    }

    const aspectRatio = anchoOriginal / altoOriginal;

    if (anchoDeseado / altoDeseado > aspectRatio) {
      return {
        ancho: Math.round(altoDeseado * aspectRatio),
        alto: altoDeseado
      };
    } else {
      return {
        ancho: anchoDeseado,
        alto: Math.round(anchoDeseado / aspectRatio)
      };
    }
  }

  /**
   * Aplica transformaciones como rotación a la imagen
   */
  private aplicarTransformaciones(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    ancho: number,
    alto: number,
    rotacion: number
  ): void {
    if (rotacion !== 0) {
      ctx.translate(ancho / 2, alto / 2);
      ctx.rotate((rotacion * Math.PI) / 180);
      ctx.drawImage(img, -ancho / 2, -alto / 2, ancho, alto);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Resetear transformación
    } else {
      // Dibujar imagen sin rotación
      ctx.drawImage(img, 0, 0, ancho, alto);
    }
  }

  /**
   * Aplica ajustes de brillo y contraste a la imagen
   */
  private aplicarAjustesImagen(
    ctx: CanvasRenderingContext2D,
    ancho: number,
    alto: number,
    brillo: number,
    contraste: number
  ): void {
    const imageData = ctx.getImageData(0, 0, ancho, alto);
    const data = imageData.data;

    // Normalizar valores
    const brightness = brillo / 100;
    const contrast = contraste / 100;

    // Factor de contraste
    const factor = contrast !== 0 ? (259 * (contrast + 1)) / (255 * (1 - contrast)) : 1;

    // Optimización: procesar píxeles solo si hay ajustes que aplicar
    if (brightness === 0 && contrast === 0) return;

    for (let i = 0; i < data.length; i += 4) {
      // Aplicar brillo
      if (brightness !== 0) {
        const brightValue = 255 * brightness;
        data[i] += brightValue;
        data[i + 1] += brightValue;
        data[i + 2] += brightValue;
      }

      // Aplicar contraste
      if (contrast !== 0) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
      }

      // Limitar valores al rango 0-255
      data[i] = Math.max(0, Math.min(255, data[i]));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Detecta las dimensiones originales de una imagen
   */
  detectarDimensionesOriginales(file: File): Promise<{ ancho: number, alto: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        resolve({
          ancho: img.width,
          alto: img.height
        });
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        resolve({ ancho: 800, alto: 600 }); // Valores por defecto en caso de error
        URL.revokeObjectURL(url);
      };

      img.src = url;
    });
  }
}
