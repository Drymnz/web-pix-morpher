export interface ImageProcessingOptions {
    formato: string;
    calidad: number;
    ancho: number;
    alto: number;
    mantenerAspecto: boolean;
    rotacion: number;
    brillo: number;
    contraste: number;
  }
  
  export interface FormatoInfo {
    mimeType: string;
    soportaTransparencia: boolean;
    conPerdida: boolean;
  }
  
  export const FORMATOS_MAPA: Record<string, FormatoInfo> = {
    'png': {
      mimeType: 'image/png',
      soportaTransparencia: true,
      conPerdida: false
    },
    'jpg': {
      mimeType: 'image/jpeg',
      soportaTransparencia: false,
      conPerdida: true
    },
    'jpeg': {
      mimeType: 'image/jpeg',
      soportaTransparencia: false,
      conPerdida: true
    },
    'webp': {
      mimeType: 'image/webp',
      soportaTransparencia: true,
      conPerdida: true
    }
  };