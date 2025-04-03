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
        this.segmentation.setOptions({ modelSelection: 1 });
      });
    }
  }

  async removeBackground(image: HTMLImageElement, canvas: HTMLCanvasElement): Promise<string> {
    if (typeof window === 'undefined') return '';

    const { SelfieSegmentation } = await import('@mediapipe/selfie_segmentation');
    const segmentation = new SelfieSegmentation({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
    });

    segmentation.setOptions({ modelSelection: 1 });

    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No se pudo obtener el contexto del canvas');

      // ⚠️ Dibuja la imagen original antes de aplicar la segmentación
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      segmentation.onResults(async (results: any) => {
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';

        // ⚠️ Convertir el canvas en un Blob para descargar
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

}
